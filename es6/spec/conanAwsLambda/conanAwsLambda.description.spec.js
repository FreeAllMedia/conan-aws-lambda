import ConanAwsLambdaPlugin from "../../lib/conanAwsLambdaPlugin.js";
import Conan from "conan";

describe("conanAwsLambda.description([newDescription])", () => {
	let lambda,
			conan;

	beforeEach(() => {
		conan = new Conan().use(ConanAwsLambdaPlugin);
		lambda = conan.lambda("SomeLambda");
	});

	it("should be null by default", () => {
		(lambda.description() === null).should.be.true;
	});

	it("should be a getter and a setter", () => {
		const description = "This is a great function!";
		lambda.description(description);
		lambda.description().should.eql(description);
	});
});
