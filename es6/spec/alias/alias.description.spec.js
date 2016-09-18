import Conan from "conan";
import ConanAwsLambdaPlugin from "../../lib/conanAwsLambdaPlugin.js";

describe("alias.description([newDescription])", () => {
	let alias,
			description;

	beforeEach(() => {
		const conan = new Conan().use(ConanAwsLambdaPlugin);
		const lambda = conan.lambda("HelloWorld");

		description = "This is a development alias";
		alias = lambda
			.alias("development")
				.description(description);
	});

  it("should be set to null by default", () => {
		(alias.description() === null).should.be.true;
	});

	it("should be a getter and a setter", () => {
		description = "production";
		alias.description(description);
		alias.description().should.eql(description);
	});
});
