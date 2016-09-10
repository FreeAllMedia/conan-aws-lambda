import Conan from "conan";
import AWS from "aws-sdk-mock";

import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";
import createRole from "../../../lib/steps/createRole.js";

describe(".createRole(conan, lambda, stepDone) (RoleArn Already Exists)", () => {
	let conan,
			lambda,
			callbackError,
			called;

	beforeEach(done => {
		called = false;

		AWS.mock("IAM", "createRole", (parameters, callback) => {
			called = true;
			callback(null);
		});

		conan = new Conan().use(ConanAwsLambdaPlugin);

		lambda = conan.lambda("NewLambda");

		lambda.roleArn("arn:aws:lambda:us-east-1:123895237541:role:SomeRole");

		createRole(conan, lambda, error => {
			callbackError = error;
			done();
		});
	});

	afterEach(() => AWS.restore("IAM"));

	it("should not callback with an error", () => {
		(callbackError === undefined).should.be.true;
	});

	it("should skip the AWS call", () => {
		called.should.be.false;
	});
});
