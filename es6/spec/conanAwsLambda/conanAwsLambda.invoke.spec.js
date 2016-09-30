import Conan from "conan";
import AWS from "aws-sdk-mock";

import ConanAwsLambdaPlugin from "../../lib/conanAwsLambdaPlugin.js";

describe("conanAwsLambda.invoke(payload, callback)", () => {
	let conan,
			lambda,
			payload,
			awsParameters,
			callbackError,
			callbackData;

	beforeEach(done => {
		setupMocks();

		conan = new Conan().use(ConanAwsLambdaPlugin);

		lambda = conan.lambda("SomeLambda");

		payload = { hello: "world" };

		lambda.invoke(payload, (error, data) => {
			callbackError = error;
			callbackData = data;
			done();
		});
	});

	afterEach(() => AWS.restore("Lambda"));

	it("should not callback with an error", () => {
		(callbackError === null).should.be.true;
	});

	it("should callback with the invoked payload", () => {
		callbackData.Payload.should.eql({ foo: "Woot!" });
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

			const responseData = {
				StatusCode: 200,
				Payload: JSON.stringify({ "foo": "Woot!" })
			};

			callback(null, responseData);
		});
	}
});
