import Conan from "conan";
import ConanAwsLambdaPlugin from "../../lib/conanAwsLambdaPlugin.js";

describe("conan.profile([newProfile])", () => {
	let conan;

	beforeEach(() => {
		conan = new Conan();
		conan.use(ConanAwsLambdaPlugin);
	});

  it("should be set to null by default", () => {
		(conan.profile() === null).should.be.true;
	});

	it("should be a getter and a setter", () => {
		const profile = "bob";
		conan.profile(profile);
		conan.profile().should.eql(profile);
	});

	it("should create a new AWS.Lambda client after setting", () => {
		const oldClient = conan.lambdaClient();
		conan.profile("us-east-3");
		const newClient = conan.lambdaClient();
		oldClient.should.not.eql(newClient);
	});

	it("should create a new AWS.IAM client after setting", () => {
		const oldClient = conan.iamClient();
		conan.profile("us-east-3");
		const newClient = conan.iamClient();
		oldClient.should.not.eql(newClient);
	});
});
