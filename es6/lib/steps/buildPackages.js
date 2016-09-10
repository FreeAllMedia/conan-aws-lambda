import temp from "temp";
import Async from "async";
import { exec } from "child_process";

export default function buildPackages(conan, lambda, stepDone) {
	if (lambda.packages()) {
		Async.waterfall([
			makeTemporaryDirectory,
			initializeNPM,
			Async.apply(buildWithNPM, lambda),
			setPackageDirectory
		], stepDone);
	} else {
		stepDone(null);
	}
}

function makeTemporaryDirectory(done) {
	temp.mkdir("buildPackage", done);
}

function initializeNPM(temporaryDirectoryPath, done) {
	exec(`cd ${temporaryDirectoryPath};npm init --yes`, error => done(error, temporaryDirectoryPath));
}

function buildWithNPM(lambda, temporaryDirectoryPath, done) {
	const packageStrings = [];

	const packages = lambda.packages();

	for (let packageName in packages) {
		const packageVersion = packages[packageName];
		packageStrings.push(`${packageName}@${packageVersion}`);
	}

	const packageString = packageStrings.join(" ");

	exec(`cd ${temporaryDirectoryPath};npm install ${packageString}`, error => done(error, lambda, temporaryDirectoryPath));
}

function setPackageDirectory(lambda, temporaryDirectoryPath, done) {
	lambda.packagesDirectory(`${temporaryDirectoryPath}/node_modules`);
	done(null);
}
