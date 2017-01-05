import ConanAwsLambdaPlugin from "../../lib/conanAwsLambdaPlugin.js";
import Conan from "conan";

describe("ConanAwsLambda(conan, name)", () => {
	let lambda,
			conan;

	beforeEach(() => {
		conan = new Conan().use(ConanAwsLambdaPlugin);
		conan.use(ConanAwsLambdaPlugin);

		lambda = conan.lambda("HelloWorld");
	});

	it("should schedule the appropriate steps", () => {
		conan.stepNames().should.eql([
			"validateLambda",
			"findLambdaByName",
			"findRoleByName",
			"createRole",
			"attachRolePolicy",
			"buildPackages",
			"compileLambdaZip",
			"upsertLambda",
			"findLambdaAliases",
			"upsertLambdaAlias"
		]);
	});

	it("should provide each step with `this` as an extra argument", () => {
		conan.stepGroups()[0].extraArguments.should.eql([ lambda ]);
	});
});
