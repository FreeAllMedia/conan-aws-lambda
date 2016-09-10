import Conan from "conan";
import AWS from "aws-sdk-mock";

import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";
import createRole from "../../../lib/steps/createRole.js";

describe(".createRole(conan, lambda, stepDone) (Exception)", () => {
	let conan,
			lambda,
			expectedError,
			actualError;

	beforeEach(done => {
		AWS.mock("IAM", "createRole", (parameters, callback) => {
			const errorMessage = "AWS returned status code 401";
			expectedError = new Error(errorMessage);
			expectedError.statusCode = 401;
			callback(expectedError);
		});

		conan = new Conan().use(ConanAwsLambdaPlugin);
		conan.role("SomeRole");

		lambda = conan.lambda("NewLambda");

		createRole(conan, lambda, error => {
			actualError = error;
			done();
		});
	});

	afterEach(() => AWS.restore("IAM"));

	it("should return an error", () => {
		expectedError.should.eql(actualError);
	});
});
