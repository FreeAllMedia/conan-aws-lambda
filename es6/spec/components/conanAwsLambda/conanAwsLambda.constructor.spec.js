import Conan from "conan";

import ConanAwsLambda from "../../../lib/components/conanAwsLambda.js";
import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";

describe("ConanAwsLambda(conan, name)", () => {
	let conan,
			name,
			lambda;

	beforeEach(() => {
		conan = new Conan().use(ConanAwsLambdaPlugin);
		name = "HelloWorld";
		lambda = new ConanAwsLambda(conan, name);
	});

	it("should copy the name to .name()", () => {
		lambda.name().should.eql(name);
	});
});
