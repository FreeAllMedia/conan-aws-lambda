import Conan from "conan";
import AWS from "aws-sdk-mock";

import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";
import createRole from "../../../lib/steps/createRole.js";

describe(".createRole(conan, lambda, stepDone) (Created)", () => {
	let conan,
			lambda,
			roleArn,
			awsParameters,
			callbackError;

	beforeEach(done => {
		AWS.mock("IAM", "createRole", (parameters, callback) => {
			awsParameters = parameters;

			const responseData = {
				Role: {
					Arn: roleArn
				}
			};
			callback(null, responseData);
		});

		conan = new Conan().use(ConanAwsLambdaPlugin);
		conan.role("SomeRole");

		lambda = conan.lambda("NewLambda");

		roleArn = "arn:aws:lambda:us-east-1:123895237541:role:SomeRole";

		createRole(conan, lambda, error => {
			callbackError = error;
			done();
		});
	});

	afterEach(() => AWS.restore("IAM"));

	it("should not callback with an error", () => {
		(callbackError === undefined).should.be.true;
	});

	it("should call AWS with the correct FunctionName", () => {
		awsParameters.should.eql({
			"RoleName": lambda.role(),
			"AssumeRolePolicyDocument": JSON.stringify({
				"Version": "2012-10-17",
				"Statement": {
					"Effect": "Allow",
					"Action": "sts:AssumeRole",
					"Principal": {
						"Service": "lambda.amazonaws.com"
					}
				}
			})
		});
	});

	it("should set lambda.roleArn to the returned FunctionArn", () => {
		lambda.roleArn().should.eql(roleArn);
	});
});
