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
	const handlerFilePath = path.join(basePath, filePath);

	appendToZip(handlerFilePath, zip);

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


		appendToZip(filePath, zip);

		next(null);
	}, done);

	done(null, zip);
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

function appendToZip(pathToAppend, zip) {
	const readStream = fileSystem.createReadStream(pathToAppend);

	zip.append(readStream, { name: filePath });
}
