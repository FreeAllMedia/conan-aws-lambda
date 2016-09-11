import ConanAwsLambdaPlugin from "../../lib/conanAwsLambdaPlugin.js";
import Conan from "conan";

describe("conanAwsLambda.handler([newArn])", () => {
	let lambda,
			conan;

	beforeEach(() => {
		conan = new Conan().use(ConanAwsLambdaPlugin);
		conan.use(ConanAwsLambdaPlugin);

		conan.handler("start");

		lambda = conan.lambda("SomeLambda");
	});

	it("should copy conan's .handler()", () => {
		lambda.handler().should.eql(conan.handler());
	});

	it("should be settable", () => {
		const handler = "invoke";
		lambda.handler(handler);
		lambda.handler().should.eql(handler);
	});
});
