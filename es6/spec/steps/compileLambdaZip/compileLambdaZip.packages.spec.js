import Conan from "conan";

import fileSystem from "graceful-fs";  // graceful-fs required to avoid file table overflow
import unzip from "unzip2";
import glob from "glob";

import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";
import compileLambdaZip from "../../../lib/steps/compileLambdaZip.js";

describe(".compileLambdaZip(conan, lambda, stepDone) (With Packages Set)", () => {
	let conan,
			lambda,
			callbackError;

	beforeEach(function (done) {
		this.timeout(30000);
		conan = new Conan().use(ConanAwsLambdaPlugin)
			.basePath(`${__dirname}/../../fixtures/`);

		lambda = conan.lambda("NewLambda").file("handler.js");

		lambda.packagesDirectory(conan.basePath() + "node_modules");

		compileLambdaZip(conan, lambda, error => {
			callbackError = error;
			done();
		});
	});

	it("should not return an error", () => {
		(callbackError === null).should.be.true;
	});

	it("should include package files in the zip", done => {
		const fixtureFileNames = glob.sync("node_modules/**/*", { cwd: conan.basePath(), dot: true, mark: true });

		const expectedFileNames = ["handler.js"].concat(fixtureFileNames);

		let actualFilePaths = [];

		fileSystem.createReadStream(lambda.zipPath())
			/* eslint-disable new-cap */
			.pipe(unzip.Parse())
			.on("entry", (entry) => actualFilePaths.push(entry.path))
			.on("close", () => {
				actualFilePaths.sort().should.eql(expectedFileNames.sort());
				done();
			});
	});

	it("should set the zip path to .zipPath()", () => {
		(lambda.zipPath() === null).should.be.false;
	});
});
