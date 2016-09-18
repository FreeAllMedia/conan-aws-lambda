import Conan from "conan";
import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";
import findLambdaAlias from "../../../lib/steps/findLambdaAliases.js";
import AWS from "aws-sdk-mock";

describe(".findLambdaAlias(conan, lambda, stepDone) (Not Found)", () => {
	let conan,
			lambda,
			awsParameters,
			expectedError;

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

	it("should NOT set the alias arns", () => {
		lambda.aliases.map(alias => alias.arn()).should.eql([null, null]);
	});

	function setupMocks() {
		awsParameters = [];

		AWS.mock("Lambda", "getAlias", (parameters, callback) => {
			awsParameters.push(parameters);
			expectedError = new Error();
			expectedError.statusCode = 404;
			callback(expectedError);
		});
	}
});
