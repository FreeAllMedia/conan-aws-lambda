"use strict";

var _conanAwsLambda = require("../../../lib/components/conanAwsLambda.js");

var _conanAwsLambda2 = _interopRequireDefault(_conanAwsLambda);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

describe("lambda.invoke(payload, callback)", function () {
	var mockConan = undefined,
	    lambda = undefined,
	    lambdaName = undefined,
	    payload = undefined,
	    lambdaConstructorSpy = undefined,
	    invoke = undefined,
	    invokeParameters = undefined,
	    invokeError = undefined,
	    invokeReturnData = undefined;

	var MockAWSLambda = function MockAWSLambda() {
		_classCallCheck(this, MockAWSLambda);

		lambdaConstructorSpy.apply(undefined, arguments);
	};

	beforeEach(function () {
		payload = {
			name: "Bob"
		};

		lambdaConstructorSpy = _sinon2.default.spy();

		var MockAWS = {
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
				add: function add() {}
			}
		};

		invokeReturnData = "";

		invoke = MockAWSLambda.prototype.invoke = _sinon2.default.spy(function (parameters, invokeCallback) {
			invokeParameters = parameters;

			invokeReturnData = "{\"message\": \"Hello, World!\"}";

			invokeCallback(null, invokeReturnData);
		});

		lambdaName = "MyLambda";
		lambda = new _conanAwsLambda2.default(mockConan, lambdaName);
	});

	it("should set the correct region for the lambda constructor", function (done) {
		lambda.invoke(payload, function () {
			lambdaConstructorSpy.calledWith({
				region: mockConan.config.region
			}).should.be.true;
			done();
		});
	});

	it("should call AWS Lambda with the correct parameters", function (done) {
		lambda.invoke(payload, function () {
			invoke.calledWith({
				FunctionName: lambda.name(),
				Qualifier: lambda.alias(),
				Payload: JSON.stringify(payload)
			}).should.be.true;
			done();
		});
	});

	it("should call AWS Lambda with the correct alias if provided", function (done) {
		lambda.alias("development");
		lambda.invoke(payload, function () {
			invoke.calledWith({
				FunctionName: lambda.name(),
				Qualifier: lambda.alias(),
				Payload: JSON.stringify(payload)
			}).should.be.true;
			done();
		});
	});

	describe("(When successful)", function () {
		it("should return the JSON parsed payload from AWS Lambda", function () {
			lambda.invoke(payload, function (error, data) {
				data.should.eql(JSON.parse(invokeReturnData));
			});
		});
	});

	describe("(When AWS Lambda returns an error)", function () {

		beforeEach(function () {
			MockAWSLambda.prototype.invoke = _sinon2.default.spy(function (parameters, callback) {
				invokeError = new Error("Lambda invoke failed!");
				callback(invokeError);
			});
		});

		it("should return the error in the callback", function (done) {
			lambda.invoke(payload, function (error) {
				error.should.eql(invokeError);
				done();
			});
		});
	});

	describe("(When region is not set on conan)", function () {
		beforeEach(function () {
			delete mockConan.config.region;
		});

		it("should return an error in the callback", function (done) {
			lambda.invoke(payload, function (error) {
				error.message.should.eql("conan.config.region is required to use .invoke().");
				done();
			});
		});
	});
});