import ConanAwsLambda from "../../../lib/components/conanAwsLambda.js";
import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";
import sinon from "sinon";

xdescribe("lambda.invoke(payload, callback) (Exception)", () => {
	let mockConan,
			lambda,
			lambdaName,
			payload,
			lambdaConstructorSpy,

			invoke,
			invokeError,
			invokeReturnData;

	class MockAWSLambda {
		constructor(...options) {
			lambdaConstructorSpy(...options);
		}
	}

	beforeEach(() => {
		payload = {
			name: "Bob"
		};

		lambdaConstructorSpy = sinon.spy();

		const MockAWS = {
			Lambda: MockAWSLambda
		};

		mockConan = {
			config: {
				region: "us-east-1"
			},
			steps: {
				libraries: {
					AWS: MockAWS
				},
				add: () => {}
			}
		};

		invokeReturnData = "";

		invoke = MockAWSLambda.prototype.invoke = sinon.spy((parameters, invokeCallback) => {
			/* eslint-disable quotes */
			invokeReturnData = `{"message": "Hello, World!"}`;

			invokeCallback(null, {
				StatusCode: 200,
				Payload: invokeReturnData
			});
		});

		lambdaName = "MyLambda";
		lambda = new ConanAwsLambda(mockConan, lambdaName);
	});

	describe("(When AWS Lambda returns an error)", () => {

		beforeEach(() => {
			MockAWSLambda.prototype.invoke = sinon.spy((parameters, callback) => {
				invokeError = new Error("Lambda invoke failed!");
				callback(invokeError);
			});
		});

		it("should return the error in the callback", done => {
			lambda.invoke(payload, error => {
				error.should.eql(invokeError);
				done();
			});
		});
	});

	describe("(When region is not set on conan)", () => {
		beforeEach(() => {
			delete mockConan.config.region;
		});

		it("should return an error in the callback", done => {
			lambda.invoke(payload, error => {
				error.message.should.eql("conan.config.region is required to use .invoke().");
				done();
			});
		});
	});
});
