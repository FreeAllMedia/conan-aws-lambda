import Conan from "conan";

import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";
import buildPackages from "../../../lib/steps/buildPackages.js";

describe(".buildPackages(conan, lambda, stepDone) (Without Packages Set)", () => {
	let conan,
			lambda,
			callbackError;

	beforeEach(done => {
		conan = new Conan().use(ConanAwsLambdaPlugin);

		lambda = conan.lambda("NewLambda");

		buildPackages(conan, lambda, error => {
			callbackError = error;
			done();
		});
	});

	it("should not callback with an error", () => {
		(callbackError === null).should.be.true;
	});

	it("should not set .packagesDirectory()", () => {
		(lambda.packagesDirectory() === null).should.eql.true;
	});
});
