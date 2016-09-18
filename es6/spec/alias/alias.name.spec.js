import Conan from "conan";
import ConanAwsLambdaPlugin from "../../lib/conanAwsLambdaPlugin.js";

describe("alias.name([newName])", () => {
	let alias,
			name;

	beforeEach(() => {
		const conan = new Conan().use(ConanAwsLambdaPlugin);
		const lambda = conan.lambda("HelloWorld");

		name = "development";
		alias = lambda.alias(name);
	});

  it("should be set to the provided constructor value by default", () => {
		alias.name().should.eql(name);
	});

	it("should be a getter and a setter", () => {
		name = "production";
		alias.name(name);
		alias.name().should.eql(name);
	});
});
