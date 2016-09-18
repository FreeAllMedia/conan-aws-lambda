import Conan from "conan";
import AWS from "aws-sdk-mock";

import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";
import findLambdaByName from "../../../lib/steps/findLambdaByName.js";

describe(".findLambdaByName(conan, lambda, stepDone) (Found)", () => {
	let conan,
			lambda,
			arn,
			awsParameters,
			callbackError;

	beforeEach(done => {
		AWS.mock("Lambda", "getFunction", (parameters, callback) => {
			awsParameters = parameters;

			const responseData = {
				Configuration: {
					FunctionArn: arn
				},
				Code: {}
			};
			callback(null, responseData);
		});

		conan = new Conan().use(ConanAwsLambdaPlugin);

		lambda = conan.lambda("NewLambda");

		arn = "arn:aws:lambda:us-east-1:123895237541:function:SomeLambda";

		findLambdaByName(conan, lambda, error => {
			callbackError = error;
			done();
		});
	});

	afterEach(() => AWS.restore("Lambda"));

	it("should not callback with an error", () => {
		(callbackError === undefined).should.be.true;
	});

	it("should call AWS with the correct FunctionName", () => {
		awsParameters.should.eql({
			FunctionName: lambda.name()
		});
	});

	it("should set lambda.arn to the returned FunctionArn", () => {
		lambda.arn().should.eql(arn);
	});
});
