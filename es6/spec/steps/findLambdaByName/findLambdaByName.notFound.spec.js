import Conan from "conan";
import AWS from "aws-sdk-mock";

import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";
import findLambdaByName from "../../../lib/steps/findLambdaByName.js";

describe(".findLambdaByName(conan, lambda, stepDone) (Not Found)", () => {
	let conan,
			lambda,
			callbackError;

	beforeEach(done => {
		conan = new Conan().use(ConanAwsLambdaPlugin);

		AWS.mock("Lambda", "getFunction", (parameters, callback) => {
			const error = new Error();
			error.statusCode = 404;
			callback(error);
		});

		lambda = conan.lambda("NewLambda");

		findLambdaByName(conan, lambda, error => {
			callbackError = error;
			done();
		});
	});

	afterEach(() => AWS.restore("Lambda"));

	it("should not callback with an error", () => {
		(callbackError === undefined).should.be.true;
	});

	it("should set lambda.arn to null", () => {
		(lambda.arn() === null).should.be.true;
	});
});
