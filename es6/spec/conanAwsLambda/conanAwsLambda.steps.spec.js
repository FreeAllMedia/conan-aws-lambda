import ConanAwsLambdaPlugin from "../../lib/conanAwsLambdaPlugin.js";
import Conan from "conan";

xdescribe("ConanAwsLambda(conan, name)", () => {
	let lambda,
			name,
			filePath,
			role,
			conan;

	beforeEach(() => {
		name = "AccountCreate";
		filePath = "/account/create.js";
		role = "SomeRole";

		conan = new Conan().use(ConanAwsLambdaPlugin);
		conan.use(ConanAwsLambdaPlugin);

		lambda = conan.lambda(name);

		lambda
			.filePath(filePath)
			.role(role);
	});

	it("should add a validate lambda step", () => {
		const step = conan.steps.findByName("validateLambdaStep");
		step.parameters.should.eql(lambda);
	});

	it("should add a find lambda by name step", () => {
		const step = conan.steps.findByName("findLambdaByNameStep");
		step.parameters.should.eql(lambda);
	});

	it("should add a find role by name step", () => {
		const step = conan.steps.findByName("findRoleByNameStep");
		step.parameters.should.eql(lambda);
	});

	it("should add a create role step", () => {
		const step = conan.steps.findByName("createRoleStep");
		step.parameters.should.eql(lambda);
	});

	it("should add a attach role policy step", () => {
		const step = conan.steps.findByName("attachRolePolicyStep");
		step.parameters.should.eql(lambda);
	});

	it("should add a compile packages step", () => {
		const step = conan.steps.findByName("buildPackageStep");
		step.parameters.should.eql(lambda);
	});

	it("should add compile lambda zip step", () => {
		const step = conan.steps.findByName("compileLambdaZipStep");
		step.parameters.should.eql(lambda);
	});

	it("should add an upsert lambda step", () => {
		const step = conan.steps.findByName("upsertLambdaStep");
		step.parameters.should.eql(lambda);
	});

	it("should add an publish lambda version step", () => {
		const step = conan.steps.findByName("publishLambdaVersionStep");
		step.parameters.should.eql(lambda);
	});

	it("should add an find lambda alias step", () => {
		const step = conan.steps.findByName("findLambdaAliasStep");
		step.parameters.should.eql(lambda);
	});

	it("should add an create lambda alias step", () => {
		const step = conan.steps.findByName("createLambdaAliasStep");
		step.parameters.should.eql(lambda);
	});

	it("should add an update lambda alias step", () => {
		const step = conan.steps.findByName("updateLambdaAliasStep");
		step.parameters.should.eql(lambda);
	});
});
