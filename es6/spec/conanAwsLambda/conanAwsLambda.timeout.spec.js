import ConanAwsLambdaPlugin from "../../lib/conanAwsLambdaPlugin.js";
import Conan from "conan";

describe("conanAwsLambda.timeout([newTimeout])", () => {
	let lambda,
			conan;

	beforeEach(() => {
		conan = new Conan().use(ConanAwsLambdaPlugin);
		lambda = conan.lambda("SomeLambda");
	});

	it("should be 3 by default", () => {
		lambda.timeout().should.eql(3);
	});

	it("should be a getter and a setter", () => {
		const timeout = 60;
		lambda.timeout(timeout);
		lambda.timeout().should.eql(timeout);
	});
});
