import Conan from "conan";
import ConanAwsLambdaPlugin from "../../lib/conanAwsLambdaPlugin.js";

describe("conanAwsLambda.publish([newValue])", () => {
	let lambda,
			conan;

	beforeEach(() => {
		conan = new Conan().use(ConanAwsLambdaPlugin);
		lambda = conan.lambda("SomeLambda");
	});

	it("should be true by default", () => {
		lambda.publish().should.eql(true);
	});

	it("should be a getter and a setter", () => {
		const publish = false;
		lambda.publish(publish);
		lambda.publish().should.eql(publish);
	});
});
