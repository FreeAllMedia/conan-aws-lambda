import ConanAwsLambdaPlugin from "../../lib/conanAwsLambdaPlugin.js";
import Conan from "conan";

describe("conanAwsLambda.roleArn([newArn])", () => {
	let lambda,
			roleArn,
			conan;

	beforeEach(() => {
		conan = new Conan().use(ConanAwsLambdaPlugin);
		conan.use(ConanAwsLambdaPlugin);

		roleArn = "arn:aws:iam::123456789012:role/Admin";

		lambda = conan.lambda("SomeLambda");
	});

	it("should be settable", () => {
		lambda.roleArn(roleArn);
		lambda.roleArn().should.eql(roleArn);
	});
});
