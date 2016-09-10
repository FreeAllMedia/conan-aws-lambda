import Conan from "conan";
import AWS from "aws-sdk-mock";

import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";
import attachRolePolicy from "../../../lib/steps/attachRolePolicy.js";

describe(".attachRolePolicy(conan, lambda, stepDone) (Exception)", () => {
	let conan,
			lambda,
			expectedError,
			actualError;

	beforeEach(done => {
		AWS.mock("IAM", "attachRolePolicy", (parameters, callback) => {
			const errorMessage = "AWS returned status code 401";
			expectedError = new Error(errorMessage);
			expectedError.statusCode = 401;
			callback(expectedError);
		});

		conan = new Conan().use(ConanAwsLambdaPlugin);
		conan.role("SomeRole");

		lambda = conan.lambda("NewLambda");

		attachRolePolicy(conan, lambda, error => {
			actualError = error;
			done();
		});
	});

	afterEach(() => AWS.restore("IAM"));

	it("should return an error", () => {
		expectedError.should.eql(actualError);
	});
});
