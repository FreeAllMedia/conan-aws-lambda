import Conan from "conan";
import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";

import validateLambda from "../../../lib/steps/validateLambda.js";

describe(".validateLambda(conan, lambda, stepDone) (When lambda is missing a file path)", () => {
	let conan,
			lambda,
			returnedError;

	beforeEach(done => {
		conan = new Conan().use(ConanAwsLambdaPlugin);

		lambda = conan.lambda("SomeLambda")
			.role("MyRole");

		validateLambda(conan, lambda, error => {
			returnedError = error;
			done();
		});
	});

	it("should return an error", () => {
		returnedError.message.should.be.eql(".file() is a required parameter to compile a lambda.");
	});
});
