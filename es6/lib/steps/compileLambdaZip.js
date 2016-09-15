import archiver from "archiver";
import temp from "temp";
import fileSystem from "graceful-fs"; // graceful-fs required to avoid file table overflow
import path from "path";
// import inflect from "jargon";
import glob from "glob";
import Async from "async";
// import hacher from "hacher";

export default function compileLambdaZip(conan, lambda, done) {
	Async.waterfall([
		createZip,
		Async.apply(addHandler, conan, lambda),
		Async.apply(addPackages, lambda),
		Async.apply(addDependencies, lambda),
		makeTemporaryDirectory,
		writeZip,
		Async.apply(setZipPath, lambda)
	], done);
}

function createZip(done) {
	const zip = archiver("zip", {});
	done(null, zip);
}

function addHandler(conan, lambda, zip, done) {
	const filePath = lambda.file();
	const basePath = lambda.basePath();

	appendToZip(filePath, basePath, zip);

	done(null, zip);
}

function addPackages(lambda, zip, done) {
	const packagesDirectory = lambda.packagesDirectory();

	if (packagesDirectory) {
		zip.directory(packagesDirectory, "node_modules");
	}

	done(null, zip);
}

function addDependencies(lambda, zip, done) {
	const dependencies = lambda.dependencies;

	Async.mapSeries(dependencies, (dependency, next) => {
		const basePath = dependency.basePath();
		let globOptions = {};

		if (dependency.basePath()) {
			globOptions.cwd = dependency.basePath();
		}

		glob(dependency.path(), globOptions, (error, filePaths) => {
			// console.log({ path: dependency.path(), globOptions, filePaths });

			filePaths.forEach(filePath => {
				appendToZip(filePath, basePath, zip, dependency.zipPath());
			});
			next(null);
		});
	}, error => {
		done(error, zip);
	});
}

function makeTemporaryDirectory(zip, done) {
	temp.mkdir("compileLambdaZip", (error, temporaryDirectoryPath) => {
		done(error, zip, temporaryDirectoryPath);
	});
}

function writeZip(zip, temporaryDirectoryPath, done) {
	const zipPath = `${temporaryDirectoryPath}/lambda.zip`;
	const writeStream = fileSystem.createWriteStream(zipPath);

	writeStream.on("close", () => {
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
	const fullPath = path.join(basePath, filePath);
	const readStream = fileSystem.createReadStream(fullPath);

	if (zipPath) {
		filePath = path.join(zipPath, filePath);
	}

	zip.append(readStream, { name: filePath });
}
