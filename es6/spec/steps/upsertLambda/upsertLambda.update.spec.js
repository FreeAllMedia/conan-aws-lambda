import Conan from "conan";
import AWS from "aws-sdk-mock";
import path from "path";
import fileSystem from "fs";

import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";
import upsertLambda from "../../../lib/steps/upsertLambda.js";

describe(".upsertLambda(conan, lambda, stepDone) (Update)", () => {
	let conan,
			lambda,
			functionArn,
			updateFunctionConfigurationParameters,
			updateFunctionCodeParameters,
			callbackError;

	beforeEach(done => {
		setupMocks();

		functionArn = "arn:aws:lambda:us-east-1:123895237541:function:SomeLambda";

		conan = new Conan().use(ConanAwsLambdaPlugin)
			.basePath(path.normalize(`${__dirname}/../../`));

		lambda = conan.lambda("SomeLambda");

		lambda
			.file("fixtures/handler.js")
			.functionArn(functionArn)
			.roleArn("arn:aws:lambda:us-east-1:123895237541:role:SomeRole")
			.description("Lambda Description")
			.memorySize(64)
			.handler("invoke")
			.timeout(300)
			.runtime("nodejs")
			.publish(false)
			.zipPath(lambda.basePath() + "fixtures/lambda.zip");

		upsertLambda(conan, lambda, error => {
			callbackError = error;
			done();
		});
	});

	afterEach(() => AWS.restore("Lambda"));

	it("should not callback with an error", () => {
		(callbackError === null).should.be.true;
	});

	it("should call AWS Lambda.updateFunctionConfiguration with the correct config", () => {
		updateFunctionConfigurationParameters.should.eql({
			FunctionName: lambda.name(),
			Handler: "fixtures/handler.invoke",
			Role: lambda.roleArn(),
			Description: lambda.description(),
			MemorySize: lambda.memorySize(),
			Timeout: lambda.timeout(),
			Runtime: lambda.runtime()
		});
	});

	it("should call AWS Lambda.updateFunctionCode with the correct config", () => {
		const zipBuffer = fileSystem.readFileSync(lambda.zipPath());

		updateFunctionCodeParameters.should.eql({
			FunctionName: lambda.name(),
			Publish: false,
			ZipFile: zipBuffer
		});
	});

	it("should set lambda.functionArn to the returned FunctionArn", () => {
		lambda.functionArn().should.eql(functionArn);
	});

	function setupMocks() {
		AWS.mock("Lambda", "updateFunctionConfiguration", (parameters, callback) => {
			updateFunctionConfigurationParameters = parameters;
			callback(null, {});
		});

		AWS.mock("Lambda", "updateFunctionCode", (parameters, callback) => {
			updateFunctionCodeParameters = parameters;
			callback(null, {});
		});
	}
});
