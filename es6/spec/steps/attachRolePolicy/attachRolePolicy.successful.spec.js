import Conan from "conan";
import AWS from "aws-sdk-mock";

import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";
import attachRolePolicy from "../../../lib/steps/attachRolePolicy.js";

describe(".attachRolePolicy(conan, lambda, stepDone) (Successful)", () => {
	let conan,
			lambda,
			awsParameters,
			callbackError;

	beforeEach(done => {
		AWS.mock("IAM", "attachRolePolicy", (parameters, callback) => {
			awsParameters = parameters;
			callback(null, {});
		});

		conan = new Conan().use(ConanAwsLambdaPlugin);
		conan.role("SomeRole");

		lambda = conan.lambda("NewLambda");

		attachRolePolicy(conan, lambda, error => {
			callbackError = error;
			done();
		});
	});

	afterEach(() => AWS.restore("IAM"));

	it("should not callback with an error", () => {
		(callbackError === undefined).should.be.true;
	});

	it("should call AWS with the correct parameters", () => {
		awsParameters.should.eql({
			"RoleName": lambda.role(),
			"PolicyArn": "arn:aws:iam::aws:policy/AWSLambdaExecute"
		});
	});
});
