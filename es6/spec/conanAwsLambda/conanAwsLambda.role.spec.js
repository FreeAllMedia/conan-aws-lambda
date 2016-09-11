import ConanAwsLambdaPlugin from "../../lib/conanAwsLambdaPlugin.js";
import Conan from "conan";

describe("conanAwsLambda.role([newRole])", () => {
	let lambda,
			conan;

	beforeEach(() => {
		conan = new Conan().use(ConanAwsLambdaPlugin);
		conan.use(ConanAwsLambdaPlugin);
		conan.role("Ben");

		lambda = conan.lambda("SomeLambda");
	});

	it("should copy conan's .role()", () => {
		lambda.role().should.eql(conan.role());
	});

	it("should be settable", () => {
		const role = "Jerry";
		lambda.role(role);
		lambda.role().should.eql(role);
	});
});
