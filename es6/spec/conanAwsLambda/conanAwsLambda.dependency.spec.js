import Dependency from "../../lib/dependency.js";
import ConanAwsLambdaPlugin from "../../lib/conanAwsLambdaPlugin.js";
import Conan from "conan";

describe("conanAwsLambda.dependency([newDependency], [dependencyOptions])", () => {
	let lambda,
			conan,
			path,
			dependency;

	beforeEach(() => {
		conan = new Conan().use(ConanAwsLambdaPlugin);

		lambda = conan.lambda("SomeLambda");

		path = "lib/*.js";
		dependency = lambda.dependency(path);
	});

	it("should create a new instance of dependency", () => {
		dependency.should.be.instanceOf(Dependency);
	});

	it("should add the new instance to .dependencies", () => {
		lambda.dependencies.should.eql([dependency]);
	});

	it("should copy the provided dependency path to .path()", () => {
		dependency.path().should.eql(path);
	});
});
