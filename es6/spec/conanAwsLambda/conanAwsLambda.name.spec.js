import ConanAwsLambdaPlugin from "../../lib/conanAwsLambdaPlugin.js";
import Conan from "conan";

describe("conanAwsLambda.name([newName])", () => {
	let lambda,
			conan;

	beforeEach(() => {
		conan = new Conan().use(ConanAwsLambdaPlugin);
		lambda = conan.lambda();
	});

	it("should be null by default", () => {
		(lambda.name() === null).should.be.true;
	});

	it("should be a getter and a setter", () => {
		const name = "MyLambda";
		lambda.name(name);
		lambda.name().should.eql(name);
	});
});
