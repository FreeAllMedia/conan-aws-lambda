import Conan from "conan";
import ConanAwsLambdaPlugin from "../../lib/conanAwsLambdaPlugin.js";
import AWS from "aws-sdk";

describe("conan.iamClient([newLambdaClient])", () => {
	let conan;

	beforeEach(() => {
		conan = new Conan().use(ConanAwsLambdaPlugin);
	});

	it("should be set to an instance of AWS.IAM by default", () => {
		console.log({ iam: AWS.IAM });
		conan.iamClient().should.be.instanceOf(AWS.IAM);
	});

	it("should be a getter and a setter", () => {
		const client = new AWS.IAM({ region: "us-east-2" });
		conan.iamClient(client);
		conan.iamClient().should.eql(client);
	});
});
