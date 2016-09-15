import Conan from "conan";

import fileSystem from "graceful-fs";  // graceful-fs required to avoid file table overflow
import unzip from "unzip2";
import path from "path";

import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";
import compileLambdaZip from "../../../lib/steps/compileLambdaZip.js";

describe(".compileLambdaZip(conan, lambda, stepDone) (With Dependency Set With Base Path)", () => {
	let conan,
			lambda,
			fixturesDirectory;

	beforeEach(function (done) {
		this.timeout(30000);

		fixturesDirectory = path.normalize(`${__dirname}/../../fixtures/`);

		conan = new Conan().use(ConanAwsLambdaPlugin)
			.basePath(fixturesDirectory);

		lambda = conan.lambda("NewLambda").file("handler.js");

		lambda.dependency("something.js").basePath(`${fixturesDirectory}lib/`);

		compileLambdaZip(conan, lambda, done);
	});

	it("should include dependency files in the zip", done => {
		const expectedFileNames = [
			"handler.js",
			"something.js"
		];

		let actualFilePaths = [];

		fileSystem.createReadStream(lambda.zipPath())
			/* eslint-disable new-cap */
			.pipe(unzip.Parse())
			.on("entry", entry => actualFilePaths.push(entry.path))
			.on("close", () => {
				actualFilePaths.sort().should.eql(expectedFileNames.sort());
				done();
			});
	});

	it("should set the zip path to .zipPath()", () => {
		(lambda.zipPath() === null).should.be.false;
	});
});
