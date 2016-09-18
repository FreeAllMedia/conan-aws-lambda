import Alias from "../../lib/alias.js";
import ConanAwsLambdaPlugin from "../../lib/conanAwsLambdaPlugin.js";
import Conan from "conan";

describe("conanAwsLambda.alias([newAlias], [aliasOptions])", () => {
	let conan,
			name,
			alias,
			lambda;

	beforeEach(() => {
		conan = new Conan().use(ConanAwsLambdaPlugin);

		lambda = conan.lambda("HelloWorld");

		name = "production";
		alias = lambda.alias(name);
	});

	it("should create a new instance of alias", () => {
		alias.should.be.instanceOf(Alias);
	});

	it("should add the new instance to .aliases", () => {
		lambda.aliases.should.eql([alias]);
	});

	it("should copy the provided alias name to .name()", () => {
		alias.name().should.eql(name);
	});
});
