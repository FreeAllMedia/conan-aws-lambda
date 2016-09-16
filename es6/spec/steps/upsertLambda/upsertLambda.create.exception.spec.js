import Conan from "conan";
import AWS from "aws-sdk-mock";
import path from "path";

import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";
import upsertLambda from "../../../lib/steps/upsertLambda.js";

describe(".upsertLambda(conan, lambda, stepDone) (Create Exception)", () => {
	let conan,
			lambda,
			expectedError,
			actualError;

	beforeEach(done => {
		expectedError = new Error("Failure.");
		AWS.mock("Lambda", "createFunction", (parameters, callback) => {
			actualError = expectedError;
			callback(actualError);
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
			actualError = error;
			done();
		});
	});

	afterEach(() => AWS.restore("Lambda"));

	it("should callback with an error", () => {
		actualError.should.eql(expectedError);
	});
});
