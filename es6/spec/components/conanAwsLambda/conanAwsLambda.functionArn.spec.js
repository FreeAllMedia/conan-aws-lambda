import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";
import Conan from "conan";

describe("conanAwsLambda.functionArn([newArn])", () => {
	let lambda,
			functionArn,
			conan;

	beforeEach(() => {
		conan = new Conan();
		conan.use(ConanAwsLambdaPlugin);

		functionArn = "arn:aws:iam::123456789012:function/HelloWorld";

		lambda = conan.lambda("SomeLambda");
	});

	it("should be settable", () => {
		lambda.functionArn(functionArn);
		lambda.functionArn.should.eql(functionArn);
	});
});
