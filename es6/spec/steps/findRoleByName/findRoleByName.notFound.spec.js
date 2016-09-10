import Conan from "conan";
import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";
import findRoleByName from "../../../lib/steps/findRoleByName.js";
import AWS from "aws-sdk-mock";

describe(".findRoleByName(conan, lambda, stepDone) (Not Found)", () => {
	let conan,
			lambda;

	beforeEach(done => {
		AWS.mock("IAM", "getRole", (parameters, callback) => {
			const error = new Error();
			error.statusCode = 404;
			callback(error);
		});

		conan = new Conan().use(ConanAwsLambdaPlugin);

		lambda = conan.lambda("HelloWorld");

		findRoleByName(conan, lambda, done);
	});

	afterEach(() => AWS.restore("IAM"));

	it("should return the roleArn as null", () => {
		(lambda.roleArn() === null).should.be.true;
	});
});
