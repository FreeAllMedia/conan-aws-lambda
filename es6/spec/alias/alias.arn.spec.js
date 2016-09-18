import Conan from "conan";
import ConanAwsLambdaPlugin from "../../lib/conanAwsLambdaPlugin.js";

describe("alias.arn([newArn])", () => {
	let alias,
			arn;

	beforeEach(() => {
		const conan = new Conan().use(ConanAwsLambdaPlugin);
		const lambda = conan.lambda("HelloWorld");

		arn = "arn:aws:iam::123456789012:function:HelloWorld";
		alias = lambda.alias(arn);
	});

  it("should be set to the provided constructor value by default", () => {
		alias.arn().should.eql(arn);
	});

	it("should be a getter and a setter", () => {
		arn = "arn:aws:iam::123456789012:function:HelloWorld:production";

		alias.arn(arn);
		alias.arn().should.eql(arn);
	});
});
