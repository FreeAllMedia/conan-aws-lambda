"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = findLambdaByName;

var _awsSdk = require("aws-sdk");

var _awsSdk2 = _interopRequireDefault(_awsSdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function findLambdaByName(conan, lambda, stepDone) {
	var awsLambda = new _awsSdk2.default.Lambda({
		region: conan.config.region
	});
	var lambdaName = void 0;
	if (typeof lambda.name === "function") {
		lambdaName = lambda.name();
	} else {
		lambdaName = lambda.lambda()[0];
	}

	if (lambdaName) {
		awsLambda.getFunction({
			"FunctionName": lambdaName
		}, function (error, responseData) {
			if (error && error.statusCode === 404) {
				stepDone(null, {
					lambdaArn: null
				});
			} else if (error) {
				stepDone(error);
			} else {
				stepDone(null, {
					lambdaArn: responseData.Configuration.FunctionArn
				});
			}
		});
	} else {
		stepDone(null, {
			lambdaArn: null
		});
	}
}