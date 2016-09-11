import Conan from "conan";
import ConanAwsLambdaPlugin from "../../lib/conanAwsLambdaPlugin.js";

describe("dependency.basePath([newBasePath])", () => {
	let conan,
			lambda,
			dependency;

	beforeEach(() => {
		conan = new Conan().use(ConanAwsLambdaPlugin);
		lambda = conan.lambda("SomeLambda");
		dependency = lambda.dependency("something/*.js");
	});

	it("should inherit from lambda by default", () => {
		dependency.basePath().should.eql(lambda.basePath());
	});

	it("should have a setter and a getter", () => {
		const basePath = "/some/path";
		dependency.basePath(basePath);
		dependency.basePath().should.eql(basePath);
	});
});
