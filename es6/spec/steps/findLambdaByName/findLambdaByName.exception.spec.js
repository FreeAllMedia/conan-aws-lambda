import Conan from "conan";
import AWS from "aws-sdk-mock";

import ConanAwsLambda from "../../../lib/components/conanAwsLambda.js";
import findLambdaByName from "../../../lib/steps/findLambdaByName.js";

describe(".findLambdaByName(conan, lambda, stepDone) (Exception)", () => {
	let conan,
			lambda,
			returnedError,
			callbackError;

	beforeEach(done => {
		conan = new Conan({
			region: "us-east-1"
		});

		lambda = new ConanAwsLambda(conan, "NewLambda");

		AWS.mock("Lambda", "getFunction", (parameters, callback) => {
			returnedError = new Error();
			returnedError.statusCode = 500;
			callback(returnedError);
		});

		findLambdaByName(conan, lambda, error => {
			callbackError = error;
			done();
		});
	});

	afterEach(() => AWS.restore("Lambda", "getFunction"));

	it("should callback with the returned error", () => {
		callbackError.should.eql(returnedError);
	});

	it("should set lambda.functionArn to null", () => {
		(lambda.functionArn() === null).should.be.true;
	});
});
