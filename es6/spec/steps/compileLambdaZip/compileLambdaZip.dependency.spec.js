import Conan from "conan";

import fileSystem from "graceful-fs";  // graceful-fs required to avoid file table overflow
import unzip from "unzip2";

import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";
import compileLambdaZip from "../../../lib/steps/compileLambdaZip.js";

describe(".compileLambdaZip(conan, lambda, stepDone) (With Dependency Set)", () => {
	let conan,
			lambda,
			callbackError;

	beforeEach(function (done) {
		this.timeout(30000);

		conan = new Conan().use(ConanAwsLambdaPlugin)
			.basePath(`${__dirname}/../../fixtures/`);

		lambda = conan.lambda("NewLambda").file("handler.js");

		lambda.dependency("d*y.js");

		compileLambdaZip(conan, lambda, error => {
			callbackError = error;
			done();
		});
	});

	it("should not return an error", () => {
		(callbackError === null).should.be.true;
	});

	it("should include dependency files in the zip", done => {
		const expectedFileNames = [
			"handler.js",
			"dependency.js",
			"diy.js"
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
