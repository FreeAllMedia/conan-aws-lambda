import Conan from "conan";

import fileSystem from "graceful-fs";  // graceful-fs required to avoid file table overflow
import unzip from "unzip2";
import path from "path";

import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";
import compileLambdaZip from "../../../lib/steps/compileLambdaZip.js";

describe(".compileLambdaZip(conan, lambda, stepDone) (With Packages Set)", () => {
	let conan,
			lambda;

	beforeEach(function (done) {
		this.timeout(30000);

		conan = new Conan().use(ConanAwsLambdaPlugin);

		lambda = conan.lambda("NewLambda").file("handler.js");

		const fixturesDirectory = path.normalize(`${__dirname}/../fixtures/`);

		lambda
			.dependency("d*y.js")
				.basePath(fixturesDirectory);

		compileLambdaZip(conan, lambda, done);
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
				actualFilePaths.should.eql(expectedFileNames);
				done();
			});
	});

	it("should set the zip path to .zipPath()", () => {
		(lambda.zipPath() === null).should.be.false;
	});
});
