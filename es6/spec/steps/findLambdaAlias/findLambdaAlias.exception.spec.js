import Conan from "conan";
import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";
import findLambdaAlias from "../../../lib/steps/findLambdaAliases.js";
import AWS from "aws-sdk-mock";

describe(".findLambdaAlias(conan, lambda, stepDone) (Exception)", () => {
	let conan,
			lambda,
			expectedError,
			actualError;

	beforeEach(done => {
		setupMocks();

		conan = new Conan().use(ConanAwsLambdaPlugin);

		lambda = conan.lambda("HelloWorld");

		lambda
			.alias("development")
			.alias("production");

		findLambdaAlias(conan, lambda, error => {
			actualError = error;
			done();
		});
	});

	afterEach(() => AWS.restore("Lambda"));

	it("should be a function", () => {
		(typeof findLambdaAlias).should.equal("function");
	});

	it("should return the exception", () => {
		actualError.should.eql(expectedError);
	});

	it("should NOT set the alias arns", () => {
		lambda.aliases.map(alias => alias.arn()).should.eql([null, null]);
	});

	function setupMocks() {
		AWS.mock("Lambda", "getAlias", (parameters, callback) => {
			expectedError = new Error();
			expectedError.statusCode = 500;
			callback(expectedError);
		});
	}
});
