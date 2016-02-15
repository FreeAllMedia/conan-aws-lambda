"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _conan = require("conan");

var _conan2 = _interopRequireDefault(_conan);

var _createRoleStep = require("../../lib/steps/createRoleStep.js");

var _createRoleStep2 = _interopRequireDefault(_createRoleStep);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

describe(".createRoleStep(conan, context, stepDone)", function () {
	var conan = undefined,
	    context = undefined,
	    stepDone = undefined,
	    awsResponseError = undefined,
	    awsResponseData = undefined,
	    stepReturnError = undefined,
	    stepReturnData = undefined,
	    parameters = undefined;

	var mockIam = {
		createRole: _sinon2.default.spy(function (params, callback) {
			callback(awsResponseError, awsResponseData);
		})
	};

	var MockAWS = {
		IAM: _sinon2.default.spy(function () {
			return mockIam;
		})
	};

	beforeEach(function () {
		conan = new _conan2.default({
			region: "us-east-1"
		});

		parameters = new (function () {
			function MockConanAwsLambda() {
				_classCallCheck(this, MockConanAwsLambda);
			}

			_createClass(MockConanAwsLambda, [{
				key: "role",
				value: function role() {
					return "TestRole";
				}
			}]);

			return MockConanAwsLambda;
		}())();

		context = {
			parameters: parameters,
			libraries: { AWS: MockAWS },
			results: {}
		};

		// "Role Found" response by default
		awsResponseData = {
			Role: {
				Arn: "arn:aws:lambda:us-east-1:123895237541:role:SomeRole"
			}
		};
		awsResponseError = null;
	});

	describe("(When calling AWS)", function () {
		beforeEach(function (done) {
			stepDone = function stepDone(afterStepCallback) {
				return function (error, data) {
					stepReturnError = error;
					stepReturnData = data;
					afterStepCallback();
				};
			};

			(0, _createRoleStep2.default)(conan, context, stepDone(done));
		});

		it("should be a function", function () {
			(typeof _createRoleStep2.default === "undefined" ? "undefined" : _typeof(_createRoleStep2.default)).should.equal("function");
		});

		it("should set the designated region on the lambda client", function () {
			MockAWS.IAM.calledWith({
				region: conan.config.region
			}).should.be.true;
		});

		it("should call AWS with the designated role name parameter", function () {
			mockIam.createRole.calledWith({
				RoleName: context.parameters.role(),
				AssumeRolePolicyDocument: JSON.stringify({
					"Version": "2012-10-17",
					"Statement": {
						"Effect": "Allow",
						"Action": "sts:AssumeRole",
						"Principal": {
							"Service": "lambda.amazonaws.com"
						}
					}
				})
			}).should.be.true;
		});

		describe("(Role is Created)", function () {
			it("should return the role arn", function () {
				stepReturnData.should.eql({
					roleArn: awsResponseData.Role.Arn
				});
			});
		});

		describe("(Unknown Error is Returned)", function () {
			var errorMessage = undefined;

			beforeEach(function (done) {
				errorMessage = "AWS returned status code 401";
				awsResponseError = { statusCode: 401, message: errorMessage };
				(0, _createRoleStep2.default)(conan, context, stepDone(done));
			});

			it("should return an error which stops the step runner", function () {
				stepReturnError.message.should.eql(errorMessage);
			});
		});
	});

	describe("(When it was found before)", function () {
		beforeEach(function (done) {
			mockIam.createRole = _sinon2.default.spy();
			stepDone = function stepDone(afterStepCallback) {
				return function () {
					afterStepCallback();
				};
			};
			context.results.roleArn = "something";
			(0, _createRoleStep2.default)(conan, context, stepDone(done));
		});

		it("should skip the AWS call entirely", function () {
			mockIam.createRole.called.should.be.false;
		});
	});
});