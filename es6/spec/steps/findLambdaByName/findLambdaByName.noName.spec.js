import Conan from "conan";

import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";
import findLambdaByName from "../../../lib/steps/findLambdaByName.js";

describe(".findLambdaByName(conan, lambda, stepDone) (No Lambda Name)", () => {
	let conan,
			lambda,
			callbackError;

	beforeEach(done => {
		conan = new Conan().use(ConanAwsLambdaPlugin);

		lambda = conan.lambda();

		findLambdaByName(conan, lambda, error => {
			callbackError = error;
			done();
		});
	});

	it("should not callback with an error", () => {
		(callbackError === undefined).should.be.true;
	});

	it("should not affect the .functionArn()", () => {
		(lambda.functionArn() === null).should.be.true;
	});
});
