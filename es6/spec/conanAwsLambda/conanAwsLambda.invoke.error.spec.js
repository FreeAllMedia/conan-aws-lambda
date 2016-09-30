import Conan from "conan";
import AWS from "aws-sdk-mock";

import ConanAwsLambdaPlugin from "../../lib/conanAwsLambdaPlugin.js";

describe("conanAwsLambda.invoke(payload, callback) (Error)", () => {
	let conan,
			lambda,
			payload,
			awsParameters,
			expectedError,
			actualError;

	beforeEach(done => {
		setupMocks();

		conan = new Conan().use(ConanAwsLambdaPlugin);

		lambda = conan.lambda("SomeLambda");

		payload = { hello: "world" };

		lambda.invoke(payload, (error) => {
			actualError = error;
			done();
		});
	});

	afterEach(() => AWS.restore("Lambda"));

	it("should callback with an error", () => {
		actualError.should.eql(expectedError);
	});

	it("should call AWS with the correct parameters", () => {
		awsParameters.should.eql({
			FunctionName: lambda.name(),
			Payload: JSON.stringify(payload),
			InvocationType: "RequestResponse",
			LogType: "None"
		});
	});

	function setupMocks() {
		AWS.mock("Lambda", "invoke", (parameters, callback) => {
			awsParameters = parameters;

			expectedError = new Error();

			callback(expectedError);
		});
	}
});
