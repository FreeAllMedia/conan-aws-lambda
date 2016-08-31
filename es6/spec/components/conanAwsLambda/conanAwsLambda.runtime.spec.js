import ConanAwsLambda from "../../../lib/components/conanAwsLambda.js";
import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";
import Conan from "conan";

describe("conanAwsLambda.runtime([newRuntime])", () => {
	let lambda,
			conan;

	beforeEach(() => {
		conan = new Conan().use(ConanAwsLambdaPlugin);
		lambda = new ConanAwsLambda(conan);
	});

	it("should be 'nodejs' by default", () => {
		lambda.runtime().should.eql("nodejs");
	});

	it("should be a getter and a setter", () => {
		const runtime = "python";
		lambda.runtime(runtime);
		lambda.runtime().should.eql(runtime);
	});
});
