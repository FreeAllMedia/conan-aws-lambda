import ConanAwsLambda from "../../../lib/components/conanAwsLambda.js";
import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";
import Conan from "conan";

describe("conanAwsLambda.publish([newValue])", () => {
	let lambda,
			conan;

	beforeEach(() => {
		conan = new Conan().use(ConanAwsLambdaPlugin);
		lambda = new ConanAwsLambda(conan);
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
