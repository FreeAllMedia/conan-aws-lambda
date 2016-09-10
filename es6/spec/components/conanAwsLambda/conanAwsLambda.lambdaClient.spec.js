import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";
import Conan from "conan";
import AWS from "aws-sdk";

describe("conanAwsLambda.lambdaClient([newClient])", () => {
	let lambda,
			conan;

	beforeEach(() => {
		conan = new Conan().use(ConanAwsLambdaPlugin);
		conan.use(ConanAwsLambdaPlugin);

		conan.region("us-east-2");

		lambda = conan.lambda("SomeLambda");
	});

	it("should copy conan's .lambdaClient()", () => {
		lambda.lambdaClient().should.eql(conan.lambdaClient());
	});

	it("should be a getter and a setter", () => {
		const client = new AWS.IAM({ region: "us-east-1" });
		conan.lambdaClient(client);
		conan.lambdaClient().should.eql(client);
	});
});