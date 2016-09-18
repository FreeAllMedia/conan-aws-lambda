import Conan from "conan";
import AWS from "aws-sdk-mock";

import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";
import createLambdaAliases from "../../../lib/steps/createLambdaAliases.js";

describe(".createLambdaAliases(conan, lambda, stepDone) (Created)", () => {
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

		lambda
			.version("2")
			.alias("development")
			.alias("production");

		aliasArn = "arn:aws:lambda:us-east-1:123895237541:alias:production";

		createLambdaAliases(conan, lambda, error => {
			callbackError = error;
			done();
		});
	});

	afterEach(() => AWS.restore("Lambda"));

	it("should not callback with an error", () => {
		(callbackError === undefined).should.be.true;
	});

	it("should call AWS with the correct FunctionName", () => {
		awsParameters.should.eql([
			{
				"FunctionName": lambda.name(),
				"FunctionVersion": lambda.version(),
				"Name": "development"
			},
			{
				"FunctionName": lambda.name(),
				"FunctionVersion": lambda.version(),
				"Name": "production"
			}
		]);
	});

	it("should set the found role Arn to lambda.aliasArn()", () => {
		lambda.aliases.map(alias => alias.arn()).should.eql([
			aliasArn,
			aliasArn
		]);
	});

	function setupMocks() {
		awsParameters = [];
		AWS.mock("Lambda", "createAlias", (parameters, callback) => {
			awsParameters.push(parameters);

			const responseData = {
				AliasArn: aliasArn
			};
			callback(null, responseData);
		});
	}
});
