import Conan from "conan";

import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";
import buildPackages from "../../../lib/steps/buildPackages.js";

describe(".buildPackages(conan, lambda, stepDone) (Exception)", () => {
	let conan,
			lambda,
			callbackError;

	beforeEach(function (done) {
		this.timeout(30000);
		conan = new Conan().use(ConanAwsLambdaPlugin);

		lambda = conan.lambda("NewLambda");

		lambda.packages({
			"semver": "5.3.0",
			"is-sorted": "0.0.111" // Bad version number
		});

		buildPackages(conan, lambda, error => {
			callbackError = error;
			done();
		});
	});

	it("should return the error", () => {
		callbackError.should.be.instanceOf(Error);
	});
});
