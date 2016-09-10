import Conan from "conan";
import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";
import findRoleByName from "../../../lib/steps/findRoleByName.js";
import AWS from "aws-sdk-mock";

describe(".findRoleByName(conan, lambda, stepDone) (Exception)", () => {
	let conan,
			returnedError,
			expectedError,
			lambda;

	beforeEach(done => {
		AWS.mock("IAM", "getRole", (parameters, callback) => {
			expectedError = new Error();
			expectedError.statusCode = 500;
			callback(expectedError);
		});

		conan = new Conan().use(ConanAwsLambdaPlugin);

		lambda = conan.lambda("HelloWorld");

		findRoleByName(conan, lambda, error => {
			returnedError = error;
			done();
		});
	});

	afterEach(() => AWS.restore("IAM"));

	it("should return the roleArn as null", () => {
		returnedError.should.eql(expectedError);
	});
});
