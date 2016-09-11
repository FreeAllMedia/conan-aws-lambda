import ConanAwsLambdaPlugin from "../../lib/conanAwsLambdaPlugin.js";
import Conan from "conan";

describe("conanAwsLambda.version([newVersion])", () => {
	let lambda,
			conan;

	beforeEach(() => {
		conan = new Conan().use(ConanAwsLambdaPlugin);
		lambda = conan.lambda("SomeLambda");
	});

	it("should be null by default", () => {
		(lambda.version() === null).should.be.true;
	});

	it("should be a getter and a setter", () => {
		const version = "3";
		lambda.version(version);
		lambda.version().should.eql(version);
	});
});
