import Dependency from "../../lib/dependency.js";
import ConanAwsLambdaPlugin from "../../lib/conanAwsLambdaPlugin.js";
import Conan from "conan";

describe("conan.dependency([newDependency], [dependencyOptions])", () => {
	let conan,
			path,
			dependency;

	beforeEach(() => {
		conan = new Conan().use(ConanAwsLambdaPlugin);
		path = "lib/*.js";
		dependency = conan.dependency(path);
	});

	it("should create a new instance of dependency", () => {
		dependency.should.be.instanceOf(Dependency);
	});

	it("should add the new instance to .dependencies", () => {
		conan.dependencies.should.eql([dependency]);
	});

	it("should copy the provided dependency path to .path()", () => {
		dependency.path().should.eql(path);
	});
});
