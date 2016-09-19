import Conan from "conan";
import AWS from "aws-sdk-mock";

import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";
import upsertLambdaAliases from "../../../lib/steps/upsertLambdaAliases.js";

describe(".upsertLambdaAliases(conan, lambda, stepDone) (Create Exception)", () => {
	let conan,
			lambda,
			expectedError,
			actualError;

	beforeEach(done => {
		setupMocks();

		conan = new Conan().use(ConanAwsLambdaPlugin);
		conan.role("SomeRole");

		lambda = conan.lambda("NewLambda");

		lambda
			.alias("development")
			.alias("production");

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
		AWS.mock("Lambda", "createAlias", (parameters, callback) => {
			expectedError = new Error("Doh!");
			callback(expectedError);
		});
	}
});
