import Conan from "conan";
import ConanAwsLambdaPlugin from "../../lib/conanAwsLambdaPlugin.js";

describe("dependency.zipPath([newZipPath])", () => {
	let conan,
			lambda,
			dependency;

	beforeEach(() => {
		conan = new Conan().use(ConanAwsLambdaPlugin);
		lambda = conan.lambda("SomeLambda");
		dependency = lambda.dependency("something/*.js");
	});

	it("should be set to null by default", () => {
		(dependency.zipPath() === null).should.be.true;
	});

	it("should have a setter and a getter", () => {
		const zipPath = "/some/path";
		dependency.zipPath(zipPath);
		dependency.zipPath().should.eql(zipPath);
	});
});
