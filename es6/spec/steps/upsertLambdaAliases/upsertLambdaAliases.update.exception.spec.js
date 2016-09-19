import Conan from "conan";
import AWS from "aws-sdk-mock";

import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";
import upsertLambdaAliases from "../../../lib/steps/upsertLambdaAliases.js";

describe(".upsertLambdaAliases(conan, lambda, stepDone) (Update Exception)", () => {
	let conan,
			lambda,
			aliasArn,
			expectedError,
			actualError;

	beforeEach(done => {
		setupMocks();

		conan = new Conan().use(ConanAwsLambdaPlugin);
		conan.role("SomeRole");

		lambda = conan.lambda("NewLambda");

		aliasArn = "arn:aws:lambda:us-east-1:123895237541:alias:production";

		lambda
			.alias("development")
				.arn(aliasArn)
			.alias("production")
				.arn(aliasArn);

		upsertLambdaAliases(conan, lambda, error => {
			actualError = error;
			done();
		});
	});

	afterEach(() => AWS.restore("Lambda"));

	it("should callback with an error", () => {
		actualError.should.eql(expectedError);
	});

	function setupMocks() {
		AWS.mock("Lambda", "updateAlias", (parameters, callback) => {
			expectedError = new Error("Doh!");
			callback(expectedError);
		});
	}
});
