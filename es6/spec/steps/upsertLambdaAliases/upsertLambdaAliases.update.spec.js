import Conan from "conan";
import AWS from "aws-sdk-mock";

import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";
import upsertLambdaAliases from "../../../lib/steps/upsertLambdaAliases.js";

describe(".upsertLambdaAliases(conan, lambda, stepDone) (Update)", () => {
	let conan,
			lambda,
			aliasArn,
			awsParameters,
			callbackError;

	beforeEach(done => {
		setupMocks();

		conan = new Conan().use(ConanAwsLambdaPlugin);
		conan.role("SomeRole");

		lambda = conan.lambda("NewLambda");

		aliasArn = "arn:aws:lambda:us-east-1:123895237541:alias:production";

		lambda
			.alias("development")
				.description("The Development Environment")
				.arn(aliasArn)
			.alias("production")
				.description("The Production Environment")
				.arn(aliasArn);

		upsertLambdaAliases(conan, lambda, error => {
			callbackError = error;
			done();
		});
	});

	afterEach(() => AWS.restore("Lambda"));

	it("should not callback with an error", () => {
		(callbackError === null).should.be.true;
	});

	it("should call AWS with the correct parameters", () => {
		awsParameters.should.eql([
			{
				"FunctionName": lambda.name(),
				"FunctionVersion": "$LATEST",
				"Name": "development",
				"Description": "The Development Environment"
			},
			{
				"FunctionName": lambda.name(),
				"FunctionVersion": "$LATEST",
				"Name": "production",
				"Description": "The Production Environment"
			}
		]);
	});

	function setupMocks() {
		awsParameters = [];
		AWS.mock("Lambda", "updateAlias", (parameters, callback) => {
			awsParameters.push(parameters);

			const responseData = {
				AliasArn: aliasArn
			};
			callback(null, responseData);
		});
	}
});
