import Conan from "conan";
import fileSystem from "fs";

import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";
import buildPackages from "../../../lib/steps/buildPackages.js";

describe(".buildPackages(conan, lambda, stepDone) (With Packages Set)", () => {
	let conan,
			lambda,
			callbackError;

	beforeEach(function (done) {
		this.timeout(30000);
		conan = new Conan().use(ConanAwsLambdaPlugin);

		lambda = conan.lambda("NewLambda");

		lambda.packages({
			"semver": "5.3.0",
			"is-sorted": "1.0.2"
		});

		buildPackages(conan, lambda, error => {
			callbackError = error;
			done();
		});
	});

	it("should not return an error", () => {
		(callbackError === null).should.be.true;
	});

	it("should build each package in a temp directory", () => {
		const expectedFileNames = [
			".bin",
			"semver",
			"is-sorted"
		];

		const actualFileNames = fileSystem.readdirSync(lambda.packagesDirectory());

		actualFileNames.should.contain.members(expectedFileNames);
	});

	it("should set the temp directory to .packagesDirectory()", () => {
		(lambda.packagesDirectory() === null).should.be.false;
	});
});
