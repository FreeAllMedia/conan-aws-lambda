import Conan from "conan";
import proxyquire from "proxyquire";
import sinon from "sinon";

/**
 * Spec Mocks
 */
import MockConanAwsLambda from "../mocks/mockConanAwsLambda.js";

/**
 * Library Mocks
 */
import MockAWS from "../mocks/mockAWS.js";

const mockLibraries = {
	"aws-sdk": MockAWS
};

const findLambdaByName = proxyquire("../../lib/steps/findLambdaByName.js", mockLibraries);

describe(".findLambdaByName(conan, context, stepDone)", () => {
	let conan,
		conanAwsLambda,
		stepDone,

		awsResponseError,
		awsResponseData,

		stepReturnError,
		stepReturnData,

		parameters,
		mockLambdaSpy;

	beforeEach(done => {
		conan = new Conan({
			region: "us-east-1"
		});

		conanAwsLambda = new MockConanAwsLambda();

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

	it("should be a function", () => {
		(typeof findLambdaByName).should.equal("function");
	});

	it("should set the designated region on the lambda client", () => {
		mockLambdaSpy.calledWith({
			region: conan.config.region
		}).should.be.true;
	});

	it("should call AWS with the designated lambda name parameter", () => {
		mockLambda.getFunction.calledWith({
			FunctionName: context.parameters.name()
		}).should.be.true;
	});

	describe("(No Lambda parameter)", () => {
		it("should skip the call entirely", done => {
			parameters = new class MockConanAwsLambda {
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

	describe("(Lambda is Found)", () => {
		it("should return the found lambda id", () => {
			stepReturnData.should.eql({
				lambdaArn: awsResponseData.Configuration.FunctionArn
			});
		});

		it("should work indistinctly with a lambda parameters instead of a name parameter", done => {
			parameters = new class MockConanAwsLambda {
				lambda() { return ["TestFunctionWithLambda"]; }
			}();

			context = {
				parameters: parameters,
				libraries: { AWS: MockAWS },
				results: {}
			};

			findLambdaByName(conan, context, (error, results) => {
				results.should.eql({
					lambdaArn: awsResponseData.Configuration.FunctionArn
				});
				done();
			});
		});
	});

	describe("(Lambda is not Found)", () => {
		beforeEach(done => {
			awsResponseError = { statusCode: 404 };
			findLambdaByName(conan, context, stepDone(done));
		});

		it("should return the lambda arn as null", () => {
			const expectedData = { lambdaArn: null };
			stepReturnData.should.eql(expectedData);
		});
	});

	describe("(Unknown Error is Returned)", () => {
		let errorMessage;

		beforeEach(done => {
			errorMessage = "AWS returned status code 401";
			awsResponseError = { statusCode: 401, message: errorMessage };
			findLambdaByName(conan, context, stepDone(done));
		});

		it("should return an error which stops the step runner", () => {
			stepReturnError.message.should.eql(errorMessage);
		});
	});
});
