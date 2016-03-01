"use strict";

var _validateLambdaStep = require("../../lib/steps/validateLambdaStep.js");

var _validateLambdaStep2 = _interopRequireDefault(_validateLambdaStep);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe(".validateLambdaStep(conan, context, stepDone)", function () {
	var conan = undefined,
	    context = undefined;

	beforeEach(function () {
		conan = { config: {} };
		context = { parameters: {} };
	});

	describe("(When lambda is valid)", function () {
		beforeEach(function (done) {
			conan.config.bucket = "our-bucket";

			context.parameters = {
				role: function role() {
					return "MyIamRoleName";
				},
				packages: function packages() {
					return { async: "1.0.0" };
				}
			};
			(0, _validateLambdaStep2.default)(conan, context, stepDone(done));
		});

		it("should return nothing", function () {
			(stepReturnData === undefined).should.be.true;
		});
	});

	describe("(When lambda is missing a role)", function () {
		beforeEach(function (done) {
			context.parameters = {
				role: function role() {}
			};
			(0, _validateLambdaStep2.default)(conan, context, stepDone(done));
		});

		it("should return an error", function () {
			stepReturnError.message.should.be.eql(".role() is a required parameter for a lambda.");
		});
	});

	describe("(When lambda has packages set, but conan missing a bucket)", function () {
		beforeEach(function (done) {
			context.parameters = {
				role: function role() {
					return "MyIamRoleName";
				},
				packages: function packages() {
					return { async: "1.0.0" };
				}
			};
			(0, _validateLambdaStep2.default)(conan, context, stepDone(done));
		});

		it("should return an error", function () {
			stepReturnError.message.should.be.eql("conan.config.bucket is required to use .packages().");
		});
	});

	/* SPEC UTILITIES BELOW HERE */

	var stepReturnError = undefined;
	var stepReturnData = undefined;

	function stepDone(done) {
		return function (error, data) {
			stepReturnError = error;
			stepReturnData = data;
			done();
		};
	}
});