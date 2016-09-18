import ConanAwsLambdaPlugin from "../../lib/conanAwsLambdaPlugin.js";
import Conan from "conan";

describe("conanAwsLambda.arn([newArn])", () => {
	let lambda,
			arn,
			conan;

	beforeEach(() => {
		conan = new Conan().use(ConanAwsLambdaPlugin);
		conan.use(ConanAwsLambdaPlugin);

		arn = "arn:aws:iam::123456789012:function/HelloWorld";

		lambda = conan.lambda("SomeLambda");
	});

	it("should be settable", () => {
		lambda.arn(arn);
		lambda.arn().should.eql(arn);
	});
});
