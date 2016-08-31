import Conan from "conan";
import ConanAwsLambdaPlugin from "../../lib/conanAwsLambdaPlugin.js";

describe("conan.region([newRegion])", () => {
	let conan;

	beforeEach(() => {
		conan = new Conan();
		conan.use(ConanAwsLambdaPlugin);
	});

  it("should be set to `us-east-1` by default", () => {
		conan.region().should.eql("us-east-1");
	});

	it("should be a getter and a setter", () => {
		const region = "us-east-2";
		conan.region(region);
		conan.region().should.eql(region);
	});

	it("should create a new AWS.Lambda client after setting", () => {
		const oldClient = conan.lambdaClient();
		conan.region("us-east-3");
		const newClient = conan.lambdaClient();
		oldClient.should.not.eql(newClient);
	});

	it("should create a new AWS.IAM client after setting", () => {
		const oldClient = conan.iamClient();
		conan.region("us-east-3");
		const newClient = conan.iamClient();
		oldClient.should.not.eql(newClient);
	});
});
