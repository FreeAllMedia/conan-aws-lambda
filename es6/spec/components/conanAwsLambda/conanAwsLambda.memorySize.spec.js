import ConanAwsLambda from "../../../lib/components/conanAwsLambda.js";
import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";
import Conan from "conan";

describe("conanAwsLambda.memorySize([newMemorySize])", () => {
	let lambda,
			conan;

	beforeEach(() => {
		conan = new Conan().use(ConanAwsLambdaPlugin);
		lambda = new ConanAwsLambda(conan);
	});

	it("should be 128 by default", () => {
		lambda.memorySize().should.eql(128);
	});

	it("should be a getter and a setter", () => {
		const memorySize = 512;
		lambda.memorySize(memorySize);
		lambda.memorySize().should.eql(memorySize);
	});
});
