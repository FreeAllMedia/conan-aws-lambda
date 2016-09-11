import Conan from "conan";
import ConanAwsLambdaPlugin from "../../lib/conanAwsLambdaPlugin.js";

describe("dependency.zipBase([newZipBase])", () => {
	let conan,
			lambda,
			dependency;

	beforeEach(() => {
		conan = new Conan().use(ConanAwsLambdaPlugin);
		lambda = conan.lambda("SomeLambda");
		dependency = lambda.dependency("something/*.js");
	});

	it("should be set to null by default", () => {
		(dependency.zipBase() === null).should.be.true;
	});

	it("should have a setter and a getter", () => {
		const zipBase = "/some/path";
		dependency.zipBase(zipBase);
		dependency.zipBase().should.eql(zipBase);
	});
});
