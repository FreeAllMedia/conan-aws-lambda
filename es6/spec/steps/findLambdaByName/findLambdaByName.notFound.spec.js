import Conan from "conan";
import AWS from "aws-sdk-mock";

import ConanAwsLambda from "../../../lib/components/conanAwsLambda.js";
import findLambdaByName from "../../../lib/steps/findLambdaByName.js";

describe(".findLambdaByName(conan, lambda, stepDone) (Not Found)", () => {
	let conan,
			lambda,
			callbackError;

	beforeEach(done => {
		conan = new Conan({
			region: "us-east-1"
		});

		lambda = new ConanAwsLambda(conan, "NewLambda");

		AWS.mock("Lambda", "getFunction", (parameters, callback) => {
			const error = new Error();
			error.statusCode = 404;
			callback(error);
		});

		findLambdaByName(conan, lambda, error => {
			callbackError = error;
			done();
		});
	});

	afterEach(() => AWS.restore("Lambda", "getFunction"));

	it("should not callback with an error", () => {
		(callbackError === undefined).should.be.true;
	});

	it("should set lambda.functionArn to null", () => {
		(lambda.functionArn() === null).should.be.true;
	});
});
