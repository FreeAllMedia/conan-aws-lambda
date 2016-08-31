import Conan from "conan";
import AWS from "aws-sdk-mock";

import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";
import findLambdaByName from "../../../lib/steps/findLambdaByName.js";

describe(".findLambdaByName(conan, lambda, stepDone) (Found)", () => {
	let conan,
			lambda,
			functionArn,
			awsParameters,
			callbackError;

	beforeEach(done => {
		conan = new Conan().use(ConanAwsLambdaPlugin);

		AWS.mock("Lambda", "getFunction", (parameters, callback) => {
			awsParameters = parameters;

			const responseData = {
				Configuration: {
					FunctionArn: functionArn
				},
				Code: {}
			};
			callback(null, responseData);
		});

		lambda = conan.lambda("NewLambda");

		functionArn = "arn:aws:lambda:us-east-1:123895237541:function:SomeLambda";

		findLambdaByName(conan, lambda, error => {
			callbackError = error;
			done();
		});
	});

	afterEach(() => AWS.restore("Lambda", "getFunction"));

	it("should not callback with an error", () => {
		(callbackError === undefined).should.be.true;
	});

	it("should call AWS with the correct FunctionName", () => {
		awsParameters.should.eql({
			FunctionName: lambda.name()
		});
	});

	it("should set lambda.functionArn to the returned FunctionArn", () => {
		lambda.functionArn().should.eql(functionArn);
	});
});
