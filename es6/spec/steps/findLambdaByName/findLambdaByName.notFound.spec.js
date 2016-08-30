import Conan from "conan";
import sinon from "sinon";
import AWS from "aws-sdk-mock";

import ConanAwsLambda from "../../../lib/components/conanAwsLambda.js";
import findLambdaByName from "../../lib/steps/findLambdaByName.js";

describe(".findLambdaByName(conan, lambda, stepDone) (Not Found)", () => {
	let conan,
			lambda;

	beforeEach(done => {
		conan = new Conan({
			region: "us-east-1"
		});

		conanAwsLambda = new ConanAwsLambda();

		// "Lambda Found" response by default
		awsResponseData = {
			Configuration: {
				FunctionArn: "arn:aws:lambda:us-east-1:123895237541:function:SomeLambda"
			},
			Code: {}
		};
		awsResponseError = null;

		mockLambdaSpy = sinon.spy();

		stepDone = (afterCallback) => {
			return (error, data) => {
				stepReturnError = error;
				stepReturnData = data;
				afterCallback();
			};
		};

		findLambdaByName(conan, conanAwsLambda, stepDone(done));
	});

	it("should skip the call entirely", done => {
		parameters = new class ConanAwsLambda {
			lambda() { return []; }
		}();

		context = {
			parameters: parameters,
			libraries: {
				AWS: {
					Lambda: class Lambda {}
				}
			},
			results: {}
		};

		findLambdaByName(conan, context, (error, results) => {
			(results.lambdaArn === null).should.be.true;
			done();
		});
	});
});
