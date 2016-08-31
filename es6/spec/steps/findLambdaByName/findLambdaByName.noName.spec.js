import Conan from "conan";

import ConanAwsLambda from "../../../lib/components/conanAwsLambda.js";
import findLambdaByName from "../../../lib/steps/findLambdaByName.js";

describe(".findLambdaByName(conan, lambda, stepDone) (No Lambda Name)", () => {
	let conan,
			lambda,
			callbackError;

	beforeEach(done => {
		conan = new Conan({
			region: "us-east-1"
		});

		lambda = new ConanAwsLambda(conan);

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
