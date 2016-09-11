import ConanAwsLambdaPlugin from "../../lib/conanAwsLambdaPlugin.js";
import Conan from "conan";

describe("conanAwsLambda.profile([newArn])", () => {
	let lambda,
			conan;

	beforeEach(() => {
		conan = new Conan().use(ConanAwsLambdaPlugin);
		conan.use(ConanAwsLambdaPlugin);
		conan.profile("Ben");

		lambda = conan.lambda("SomeLambda");
	});

	it("should copy conan's .profile()", () => {
		lambda.profile().should.eql(conan.profile());
	});

	it("should be settable", () => {
		const profile = "Jerry";
		lambda.profile(profile);
		lambda.profile().should.eql(profile);
	});

	it("should create a new AWS.Lambda client after setting", () => {
		const oldClient = lambda.lambdaClient();
		lambda.profile("Jerry");
		const newClient = lambda.lambdaClient();
		oldClient.should.not.eql(newClient);
	});

	it("should create a new AWS.IAM client after setting", () => {
		const oldClient = lambda.iamClient();
		lambda.profile("Jerry");
		const newClient = lambda.iamClient();
		oldClient.should.not.eql(newClient);
	});
});
