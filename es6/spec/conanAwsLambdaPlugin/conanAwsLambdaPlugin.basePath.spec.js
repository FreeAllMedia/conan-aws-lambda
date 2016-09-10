import Conan from "conan";
import ConanAwsLambdaPlugin from "../../lib/conanAwsLambdaPlugin.js";

describe("conan.basePath([newBasePath])", () => {
	let conan;

	beforeEach(() => {
		conan = new Conan();
		conan.use(ConanAwsLambdaPlugin);
	});

  it("should be set to the current working directory by default", () => {
		conan.basePath().should.eql(process.cwd());
	});

	it("should be a getter and a setter", () => {
		const basePath = "some/other/path";
		conan.basePath(basePath);
		conan.basePath().should.eql(basePath);
	});

	it("should automatically add a trailing slash when needed");
});
