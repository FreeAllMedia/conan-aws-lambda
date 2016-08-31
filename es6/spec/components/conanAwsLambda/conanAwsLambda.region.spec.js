import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";
import Conan from "conan";

describe("conanAwsLambda.region([newArn])", () => {
	let lambda,
			conan;

	beforeEach(() => {
		conan = new Conan().use(ConanAwsLambdaPlugin);
		conan.use(ConanAwsLambdaPlugin);

		conan.region("us-east-2");

		lambda = conan.lambda("SomeLambda");
	});

	it("should copy conan's .region()", () => {
		lambda.region().should.eql(conan.region());
	});

	it("should be settable", () => {
		const region = "us-east-3";
		lambda.region(region);
		lambda.region().should.eql(region);
	});
});
