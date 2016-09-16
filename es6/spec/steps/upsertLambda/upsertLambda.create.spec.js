import Conan from "conan";
import AWS from "aws-sdk-mock";
import path from "path";
import fileSystem from "fs";

import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";
import upsertLambda from "../../../lib/steps/upsertLambda.js";

describe(".upsertLambda(conan, lambda, stepDone) (Create)", () => {
	let conan,
			lambda,
			functionArn,
			awsParameters,
			callbackError;

	beforeEach(done => {
		functionArn = "arn:aws:lambda:us-east-1:123895237541:function:SomeLambda";

		AWS.mock("Lambda", "createFunction", (parameters, callback) => {
			awsParameters = parameters;

			const responseData = {
				FunctionArn: functionArn,
				Code: {}
			};
			callback(null, responseData);
		});

		conan = new Conan().use(ConanAwsLambdaPlugin)
			.basePath(path.normalize(`${__dirname}/../../`));

		lambda = conan.lambda("SomeLambda");

		lambda
			.file("fixtures/handler.js")
			.roleArn("arn:aws:lambda:us-east-1:123895237541:role:SomeRole")
			.description("Lambda Description")
			.memorySize(64)
			.handler("invoke")
			.timeout(300)
			.runtime("nodejs")
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

	it("should call AWS with the correct FunctionName", () => {
		const zipBuffer = fileSystem.readFileSync(lambda.zipPath());

		awsParameters.should.eql({
			FunctionName: lambda.name(),
			Handler: "fixtures/handler.invoke",
			Role: lambda.roleArn(),
			Description: lambda.description(),
			MemorySize: lambda.memorySize(),
			Timeout: lambda.timeout(),
			Runtime: lambda.runtime(),
			Code: {
				ZipFile: zipBuffer
			}
		});
	});

	it("should set lambda.functionArn to the returned FunctionArn", () => {
		lambda.functionArn().should.eql(functionArn);
	});
});
