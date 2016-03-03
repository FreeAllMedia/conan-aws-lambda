import ConanAwsLambda from "../../../lib/components/conanAwsLambda.js";
import sinon from "sinon";

describe("lambda.invoke(payload, callback)", () => {
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

			invokeCallback(null, invokeReturnData);
		});

		lambdaName = "MyLambda";
		lambda = new ConanAwsLambda(mockConan, lambdaName);
	});

	it("should set the correct region for the lambda constructor", done => {
		lambda.invoke(payload, () => {
			lambdaConstructorSpy.calledWith({
				region: mockConan.config.region
			}).should.be.true;
			done();
		});
	});

	it("should call AWS Lambda with the correct parameters", done => {
		lambda.invoke(payload, () => {
			invoke.calledWith({
				FunctionName: lambda.name(),
				Qualifier: lambda.alias(),
				Payload: JSON.stringify(payload)
			}).should.be.true;
			done();
		});
	});

	it("should call AWS Lambda with the correct alias if provided", done => {
		lambda.alias("development");
		lambda.invoke(payload, () => {
			invoke.calledWith({
				FunctionName: lambda.name(),
				Qualifier: lambda.alias(),
				Payload: JSON.stringify(payload)
			}).should.be.true;
			done();
		});
	});

	describe("(When successful)", () => {
		it("should return the JSON parsed payload from AWS Lambda", () => {
			lambda.invoke(payload, (error, data) => {
				data.should.eql(JSON.parse(invokeReturnData));
			});
		});
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
