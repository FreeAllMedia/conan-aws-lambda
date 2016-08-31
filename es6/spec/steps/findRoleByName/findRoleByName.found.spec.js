import Conan from "conan";
import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";
import findRoleByName from "../../../lib/steps/findRoleByName.js";
import AWS from "aws-sdk-mock";

describe(".findRoleByName(conan, lambda, stepDone) (Found)", () => {
	let conan,
			lambda,
			awsParameters,
			roleArn;

	beforeEach(done => {
		AWS.mock("IAM", "getRole", (parameters, callback) => {
			awsParameters = parameters;
			roleArn = "arn:aws:lambda:us-east-1:123895237541:role:SomeRole";
			callback(null, {
				Role: {
					Arn: roleArn
				}
			});
		});

		conan = new Conan().use(ConanAwsLambdaPlugin);

		lambda = conan.lambda("HelloWorld");

		findRoleByName(conan, lambda, done);
	});

	afterEach(() => AWS.restore("IAM", "getRole"));

	it("should be a function", () => {
		(typeof findRoleByName).should.equal("function");
	});

	it("should call AWS with the designated role name parameter", () => {
		awsParameters.should.eql({
			RoleName: lambda.role()
		});
	});

	it("should set the found role Arn to lambda.roleArn()", () => {
		lambda.roleArn().should.eql(roleArn);
	});
});
