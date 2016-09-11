import Conan from "conan";
import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";

import validateLambda from "../../../lib/steps/validateLambda.js";

describe(".validateLambda(conan, lambda, stepDone) (When lambda is missing a role)", () => {
	let conan,
			lambda,
			returnedError;

	beforeEach(done => {
		conan = new Conan().use(ConanAwsLambdaPlugin);

		lambda = conan.lambda("SomeLambda")
			.file("someFile.js");

		validateLambda(conan, lambda, error => {
			returnedError = error;
			done();
		});
	});

	it("should return an error", () => {
		returnedError.message.should.be.eql(".role() is a required parameter for a lambda.");
	});
});
