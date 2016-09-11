import Conan from "conan";
import ConanAwsLambdaPlugin from "../../lib/conanAwsLambdaPlugin.js";

describe("ConanAwsLambda(conan, name)", () => {
	let conan,
			name,
			lambda;

	beforeEach(() => {
		conan = new Conan().use(ConanAwsLambdaPlugin);
		name = "HelloWorld";
		lambda = conan.lambda(name);
	});

	it("should copy the name to .name()", () => {
		lambda.name().should.eql(name);
	});
});
