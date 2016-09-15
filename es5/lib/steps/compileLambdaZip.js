"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = compileLambdaZip;

var _archiver = require("archiver");

var _archiver2 = _interopRequireDefault(_archiver);

var _temp = require("temp");

var _temp2 = _interopRequireDefault(_temp);

var _gracefulFs = require("graceful-fs");

var _gracefulFs2 = _interopRequireDefault(_gracefulFs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _glob = require("glob");

var _glob2 = _interopRequireDefault(_glob);

var _async = require("async");

var _async2 = _interopRequireDefault(_async);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import hacher from "hacher";

// import inflect from "jargon";
function compileLambdaZip(conan, lambda, done) {
	_async2.default.waterfall([createZip, _async2.default.apply(addHandler, conan, lambda), _async2.default.apply(addPackages, lambda), _async2.default.apply(addDependencies, lambda), makeTemporaryDirectory, writeZip, _async2.default.apply(setZipPath, lambda)], done);
} // graceful-fs required to avoid file table overflow


function createZip(done) {
	var zip = (0, _archiver2.default)("zip", {});
	done(null, zip);
}

function addHandler(conan, lambda, zip, done) {
	var filePath = lambda.file();
	var basePath = lambda.basePath();

	appendToZip(filePath, basePath, zip);

	done(null, zip);
}

function addPackages(lambda, zip, done) {
	var packagesDirectory = lambda.packagesDirectory();

	if (packagesDirectory) {
		zip.directory(packagesDirectory, "node_modules");
	}

	done(null, zip);
}

function addDependencies(lambda, zip, done) {
	var dependencies = lambda.dependencies;

	_async2.default.mapSeries(dependencies, function (dependency, next) {
		var basePath = dependency.basePath();
		var globOptions = {};

		if (dependency.basePath()) {
			globOptions.cwd = dependency.basePath();
		}

		(0, _glob2.default)(dependency.path(), globOptions, function (error, filePaths) {
			// console.log({ path: dependency.path(), globOptions, filePaths });

			filePaths.forEach(function (filePath) {
				appendToZip(filePath, basePath, zip, dependency.zipPath());
			});
			next(null);
		});
	}, function (error) {
		done(error, zip);
	});
}

function makeTemporaryDirectory(zip, done) {
	_temp2.default.mkdir("compileLambdaZip", function (error, temporaryDirectoryPath) {
		done(error, zip, temporaryDirectoryPath);
	});
}

function writeZip(zip, temporaryDirectoryPath, done) {
	var zipPath = temporaryDirectoryPath + "/lambda.zip";
	var writeStream = _gracefulFs2.default.createWriteStream(zipPath);

	writeStream.on("close", function () {
		done(null, zipPath);
	});
	zip.pipe(writeStream);
	zip.finalize();
}

function setZipPath(lambda, zipPath, done) {
	lambda.zipPath(zipPath);
	done(null);
}

function appendToZip(filePath, basePath, zip, zipPath) {
	var fullPath = _path2.default.join(basePath, filePath);
	var readStream = _gracefulFs2.default.createReadStream(fullPath);

	if (zipPath) {
		filePath = _path2.default.join(zipPath, filePath);
	}

	zip.append(readStream, { name: filePath });
}