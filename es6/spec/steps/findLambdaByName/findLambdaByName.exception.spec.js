import Conan from "conan";
import AWS from "aws-sdk-mock";

import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";
import findLambdaByName from "../../../lib/steps/findLambdaByName.js";

describe(".findLambdaByName(conan, lambda, stepDone) (Exception)", () => {
	let conan,
			lambda,
			returnedError,
			callbackError;

	beforeEach(done => {
		AWS.mock("Lambda", "getFunction", (parameters, callback) => {
			returnedError = new Error();
			returnedError.statusCode = 500;
			callback(returnedError);
		});

		conan = new Conan().use(ConanAwsLambdaPlugin);

		lambda = conan.lambda("NewLambda");

		findLambdaByName(conan, lambda, error => {
			callbackError = error;
			done();
		});
	});

	afterEach(() => AWS.restore("Lambda"));

	it("should callback with the returned error", () => {
		callbackError.should.eql(returnedError);
	});

	it("should set lambda.functionArn to null", () => {
		(lambda.functionArn() === null).should.be.true;
	});
});
