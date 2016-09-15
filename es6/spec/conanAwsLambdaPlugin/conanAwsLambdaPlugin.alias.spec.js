import Conan from "conan";
import ConanAwsLambdaPlugin from "../../lib/conanAwsLambdaPlugin.js";

describe("conan.alias([newAlias])", () => {
	let conan;

	beforeEach(() => {
		conan = new Conan().use(ConanAwsLambdaPlugin);
	});

	it("should be set to null by default", () => {
		(conan.alias() === null).should.be.true;
	});

	it("should be a getter and a setter", () => {
		const alias = "production";
		conan.alias(alias);
		conan.alias().should.eql(alias);
	});
});
