import Conan from "conan";
import ConanAwsLambda from "../../lib/components/conanAwsLambda.js";
import ConanAwsLambdaPlugin from "../../lib/conanAwsLambdaPlugin.js";

import privateData from "incognito";

describe("ConanAwsLambdaPlugin(conan)", () => {
	let conan,
			lambda,
			name;

	beforeEach(() => {
		conan = new Conan();
		conan.use(ConanAwsLambdaPlugin);

		name = "AccountCreate";
		lambda = conan.lambda(name);
	});

  it("should link ConanAwsLambda", () => {
		conan.should.respondTo(lambda);
	});

	it("should return an instance of ConanAwsLambda", () => {
		lambda.should.be.instanceOf(ConanAwsLambda);
	});

	it("should pass conan to the ConanAwsLambda constructor", () => {
		privateData(lambda).conan.should.eql(conan);
	});

	it("should pass the lambda name to the ConanAwsLambda constructor", () => {
		lambda.name().should.eql(name);
	});
});
