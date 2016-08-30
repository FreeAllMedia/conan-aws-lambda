"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = compileLambdaZip;

var _archiver = require("archiver");

var _archiver2 = _interopRequireDefault(_archiver);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _gracefulFs = require("graceful-fs");

var _gracefulFs2 = _interopRequireDefault(_gracefulFs);

var _jargon = require("jargon");

var _jargon2 = _interopRequireDefault(_jargon);

var _glob = require("glob");

var _glob2 = _interopRequireDefault(_glob);

var _flowsync = require("flowsync");

var _flowsync2 = _interopRequireDefault(_flowsync);

var _hacher = require("hacher");

var _hacher2 = _interopRequireDefault(_hacher);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// graceful-fs required to avoid file table overflow


function relativePath(fullPath, basePath) {
	var normalizedFullPath = _path2.default.normalize(fullPath);

	if (basePath.substr(-1) !== "/") {
		basePath = basePath + "/";
	}

	var normalizedBasePath = _path2.default.normalize(basePath);
	var normalizedRelativePath = normalizedFullPath.replace("" + normalizedBasePath, "");

	return normalizedRelativePath;
}

function compileLambdaZip(conan, context, stepDone) {
	/* eslint-disable new-cap */
	var conanAwsLambda = context.parameters;

	var packagesDirectoryPath = context.results.packagesDirectoryPath;

	var handlerFilePath = conanAwsLambda.handler()[1];
	var handlerName = conanAwsLambda.handler()[0];

	var fileSystem = context.fileSystem || _gracefulFs2.default;

	//the lambda file path is another dependency
	conanAwsLambda.dependencies(conanAwsLambda.filePath());

	var lambdaZip = (0, _archiver2.default)("zip", {});

	if (fileSystem.existsSync(handlerFilePath)) {
		conanAwsLambda.filePath(handlerFilePath);

		var lambdaFilePath = conanAwsLambda.filePath();
		var lambdaFileName = _path2.default.basename(lambdaFilePath);
		var lambdaReadStream = fileSystem.createReadStream(lambdaFilePath);

		lambdaZip.append(lambdaReadStream, { name: lambdaFileName });
	} else {
		var _lambdaFilePath = relativePath(conanAwsLambda.filePath(), conan.config.basePath);

		var conanHandlerContent = "module.exports = {\n\t" + handlerName + ": require(\"./" + _lambdaFilePath + "\")." + handlerName + "\n};\n";

		var conanHandlerFileName = "conanHandler-" + _hacher2.default.getUUID() + ".js";

		conanAwsLambda.filePath(conanHandlerFileName);
		lambdaZip.append(conanHandlerContent, { name: conanHandlerFileName });
	}

	var lambdaZipFileName = (0, _jargon2.default)(conanAwsLambda.name()).snake.toString();
	var lambdaZipFilePath = context.temporaryDirectoryPath + "/" + lambdaZipFileName + ".zip";
	var lambdaZipWriteStream = fileSystem.createWriteStream(lambdaZipFilePath);

	var dependencies = conanAwsLambda.dependencies();

	_flowsync2.default.series([appendDependencies, appendPackages], function () {
		stepDone(null, {
			lambdaZipFilePath: lambdaZipFilePath
		});
	});

	function appendDependencies(done) {
		if (dependencies.length > 0) {
			_flowsync2.default.mapParallel(dependencies, appendDependencyGlob, done);
		} else {
			done();
		}

		function appendDependencyGlob(dependency, callback) {
			var dependencyGlob = dependency[0];
			var dependencyOptions = dependency[1] || {};
			var dependencyZipPath = dependencyOptions.zipPath || "";
			var dependencyBasePath = dependencyOptions.basePath || conan.config.basePath;

			(0, _glob2.default)(dependencyGlob, function (error, filePaths) {
				filePaths.forEach(function (filePath) {
					addPathToZip(filePath, dependencyBasePath, dependencyZipPath);
				});
				callback();
			});
		}
	}

	function appendPackages(done) {
		if (packagesDirectoryPath) {
			lambdaZip.directory(packagesDirectoryPath, "node_modules");
			//
			// const packageFilePaths = glob.sync(`${packagesDirectoryPath}/**/*`, { dot: true });
			//
			// packageFilePaths.forEach(filePath => {
			// 	//console.log("filePath", filePath);
			// 	const fileBuffer = fileSystem.readFileSync(filePath);
			// 	//console.log("fileBuffer", fileBuffer);
			// 	//const relativeFilePath = filePath.replace(packagesDirectoryPath, "");
			// 	//lambdaZip.append(fileBuffer, {name: "node_modules/" + relativeFilePath});
			// });

			packagesAppended();
		} else {
			packagesAppended();
		}

		function packagesAppended() {
			lambdaZipWriteStream.on("close", done);
			lambdaZip.pipe(lambdaZipWriteStream);
			lambdaZip.finalize();
		}
	}

	function addPathToZip(filePath, basePath, zipPath) {
		var fileStats = fileSystem.statSync(filePath);
		var isDirectory = fileStats.isDirectory();

		var relativeFilePath = relativePath(filePath, basePath);

		if (zipPath) {
			relativeFilePath = zipPath + "/" + relativeFilePath;
		}

		if (!isDirectory) {
			var fileReadStream = fileSystem.createReadStream(filePath);
			lambdaZip.append(fileReadStream, { name: relativeFilePath, stats: fileStats });
		} else {
			relativeFilePath = relativeFilePath + "/";
			lambdaZip.append("", { name: relativeFilePath, stats: fileStats });
		}
	}
}