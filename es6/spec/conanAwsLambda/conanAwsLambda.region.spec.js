import ConanAwsLambdaPlugin from "../../lib/conanAwsLambdaPlugin.js";
import Conan from "conan";

describe("conanAwsLambda.region([newArn])", () => {
	let lambda,
			conan;

	beforeEach(() => {
		conan = new Conan().use(ConanAwsLambdaPlugin);
		conan.use(ConanAwsLambdaPlugin);

		conan.region("us-east-2");

		lambda = conan.lambda("SomeLambda");
	});

	it("should copy conan's .region()", () => {
		lambda.region().should.eql(conan.region());
	});

	it("should be settable", () => {
		const region = "us-east-3";
		lambda.region(region);
		lambda.region().should.eql(region);
	});

	it("should create a new AWS.Lambda client after setting", () => {
		const oldClient = lambda.lambdaClient();
		lambda.region("us-east-3");
		const newClient = lambda.lambdaClient();
		oldClient.should.not.eql(newClient);
	});

	it("should create a new AWS.IAM client after setting", () => {
		const oldClient = lambda.iamClient();
		lambda.region("us-east-3");
		const newClient = lambda.iamClient();
		oldClient.should.not.eql(newClient);
	});
});
