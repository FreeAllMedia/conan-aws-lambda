import Conan from "conan";
import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";

import validateLambda from "../../../lib/steps/validateLambda.js";


describe(".validateLambda(conan, lambda, stepDone) (When lambda is valid)", () => {
	let conan,
			lambda,
			returnedError;

	beforeEach(done => {
		conan = new Conan().use(ConanAwsLambdaPlugin);

		lambda = conan.lambda("MyLambda")
			.role("MyIamRoleName")
			.file("someFile.js");

		validateLambda(conan, lambda, error => {
			returnedError = error;
			done();
		});
	});

	it("should not return an error", () => {
		(returnedError === undefined).should.be.true;
	});
});
