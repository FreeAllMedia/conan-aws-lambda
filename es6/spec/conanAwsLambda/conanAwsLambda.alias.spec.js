import ConanAwsLambdaPlugin from "../../lib/conanAwsLambdaPlugin.js";
import Conan from "conan";

describe("conanAwsLambda.alias([newAlias])", () => {
	let lambda,
			conan;

	beforeEach(() => {
		conan = new Conan().use(ConanAwsLambdaPlugin);
		conan.use(ConanAwsLambdaPlugin);
		conan.alias("development");
		lambda = conan.lambda("SomeLambda");
	});

	it("should copy conan's .alias()", () => {
		lambda.alias().should.eql(conan.alias());
	});

	it("should be settable", () => {
		const alias = "production";
		lambda.alias(alias);
		lambda.alias().should.eql(alias);
	});
});
