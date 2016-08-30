import archiver from "archiver";
import path from "path";
import fs from "graceful-fs"; // graceful-fs required to avoid file table overflow
import inflect from "jargon";
import glob from "glob";
import Async from "flowsync";
import hacher from "hacher";

function relativePath(fullPath, basePath) {
	const normalizedFullPath = path.normalize(fullPath);

	if (basePath.substr(-1) !== "/") {
		basePath = `${basePath}/`;
	}

	const normalizedBasePath = path.normalize(basePath);
	const normalizedRelativePath = normalizedFullPath.replace(`${normalizedBasePath}`, "");

	return normalizedRelativePath;
}

export default function compileLambdaZip(conan, context, stepDone) {
	/* eslint-disable new-cap */
	const conanAwsLambda = context.parameters;

	const packagesDirectoryPath = context.results.packagesDirectoryPath;

	const handlerFilePath = conanAwsLambda.handler()[1];
	const handlerName = conanAwsLambda.handler()[0];

	const fileSystem = context.fileSystem || fs;

	//the lambda file path is another dependency
	conanAwsLambda.dependencies(conanAwsLambda.filePath());

	const lambdaZip = archiver("zip", {});

	if (fileSystem.existsSync(handlerFilePath)) {
		conanAwsLambda.filePath(handlerFilePath);

		const lambdaFilePath = conanAwsLambda.filePath();
		const lambdaFileName = path.basename(lambdaFilePath);
		const lambdaReadStream = fileSystem.createReadStream(lambdaFilePath);

		lambdaZip.append(lambdaReadStream, {name: lambdaFileName});
	} else {
		const lambdaFilePath = relativePath(conanAwsLambda.filePath(), conan.config.basePath);

		const conanHandlerContent = `module.exports = {\n\t${handlerName}: require("./${lambdaFilePath}").${handlerName}\n};\n`;

		const conanHandlerFileName = `conanHandler-${hacher.getUUID()}.js`;

		conanAwsLambda.filePath(conanHandlerFileName);
		lambdaZip.append(conanHandlerContent, {name: conanHandlerFileName});
	}

	const lambdaZipFileName = inflect(conanAwsLambda.name()).snake.toString();
	const lambdaZipFilePath = `${context.temporaryDirectoryPath}/${lambdaZipFileName}.zip`;
	const lambdaZipWriteStream = fileSystem.createWriteStream(lambdaZipFilePath);

	const dependencies = conanAwsLambda.dependencies();

	Async.series([
		appendDependencies,
		appendPackages
	], () => {
		stepDone(null, {
			lambdaZipFilePath: lambdaZipFilePath
		});
	});

	function appendDependencies(done) {
		if (dependencies.length > 0) {
			Async.mapParallel(dependencies, appendDependencyGlob, done);
		} else {
			done();
		}

		function appendDependencyGlob(dependency, callback) {
			const dependencyGlob = dependency[0];
			const dependencyOptions = dependency[1] || {};
			const dependencyZipPath = dependencyOptions.zipPath || "";
			const dependencyBasePath = dependencyOptions.basePath || conan.config.basePath;

			glob(dependencyGlob, (error, filePaths) => {
				filePaths.forEach((filePath) => {
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
		const fileStats = fileSystem.statSync(filePath);
		const isDirectory = fileStats.isDirectory();

		let relativeFilePath = relativePath(filePath, basePath);

		if (zipPath) {
			relativeFilePath = `${zipPath}/${relativeFilePath}`;
		}

		if (!isDirectory) {
			const fileReadStream = fileSystem.createReadStream(filePath);
			lambdaZip.append(fileReadStream, { name: relativeFilePath, stats: fileStats });
		} else {
			relativeFilePath = `${relativeFilePath}/`;
			lambdaZip.append("", { name: relativeFilePath, stats: fileStats });
		}
	}
}
