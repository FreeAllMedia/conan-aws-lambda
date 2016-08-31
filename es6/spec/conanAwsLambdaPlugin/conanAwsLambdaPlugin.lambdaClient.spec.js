import Conan from "conan";
import ConanAwsLambdaPlugin from "../../lib/conanAwsLambdaPlugin.js";
import AWS from "aws-sdk";

describe("conan.lambdaClient([newLambdaClient])", () => {
	let conan;

	beforeEach(() => {
		conan = new Conan().use(ConanAwsLambdaPlugin);
	});

	it("should be set to an instance of AWS.Lambda by default", () => {
		conan.lambdaClient().should.be.instanceOf(AWS.Lambda);
	});

	it("should be a getter and a setter", () => {
		const client = new AWS.Lambda({ region: "us-east-1" });
		conan.lambdaClient(client);
		conan.lambdaClient().should.eql(client);
	});
});
