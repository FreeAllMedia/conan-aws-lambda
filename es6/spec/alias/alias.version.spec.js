import Conan from "conan";
import ConanAwsLambdaPlugin from "../../lib/conanAwsLambdaPlugin.js";

describe("alias.version([newName])", () => {
	let alias,
			version;

	beforeEach(() => {
		const conan = new Conan().use(ConanAwsLambdaPlugin);
		const lambda = conan.lambda("HelloWorld");

		version = "1";
		alias = lambda.alias(version);
	});

  it("should be set to the provided constructor value by default", () => {
		alias.version().should.eql(version);
	});

	it("should be a getter and a setter", () => {
		version = "2";
		alias.version(version);
		alias.version().should.eql(version);
	});
});
