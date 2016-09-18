import Conan from "conan";
import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";
import findLambdaAlias from "../../../lib/steps/findLambdaAliases.js";
import AWS from "aws-sdk-mock";

describe(".findLambdaAlias(conan, lambda, stepDone) (Found)", () => {
	let conan,
			lambda,
			awsParameters,
			aliasArn;

	beforeEach(done => {
		setupMocks();

		conan = new Conan().use(ConanAwsLambdaPlugin);

		lambda = conan.lambda("HelloWorld");

		lambda
			.alias("development")
			.alias("production");

		findLambdaAlias(conan, lambda, done);
	});

	afterEach(() => AWS.restore("Lambda"));

	it("should be a function", () => {
		(typeof findLambdaAlias).should.equal("function");
	});

	it("should call AWS with the correct parameters for each alias", () => {
		awsParameters.should.eql([
			{
				FunctionName: lambda.name(),
				Name: "development"
			},
			{
				FunctionName: lambda.name(),
				Name: "production"
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

		AWS.mock("Lambda", "getAlias", (parameters, callback) => {
			awsParameters.push(parameters);
			aliasArn = "arn:aws:lambda:us-east-1:123895237541:alias:SomeAlias";
			callback(null, {
				AliasArn: aliasArn
			});
		});
	}
});
