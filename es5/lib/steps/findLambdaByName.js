"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = findLambdaByName;

var _awsSdk = require("aws-sdk");

var _awsSdk2 = _interopRequireDefault(_awsSdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function findLambdaByName(conan, lambda, stepDone) {
	// TODO: Add coverage for the AWS.Lambda config here.
	// Currently not possible without lots of extra work.
	// See: https://github.com/dwyl/aws-sdk-mock/issues/38
	var awsLambda = new _awsSdk2.default.Lambda({
		region: conan.config.region
	});

	var lambdaName = lambda.name();

	if (lambdaName) {
		awsLambda.getFunction({
			"FunctionName": lambdaName
		}, function (error, responseData) {
			if (error && error.statusCode === 404) {
				stepDone();
			} else if (error) {
				stepDone(error);
			} else {
				lambda.functionArn(responseData.Configuration.FunctionArn);
				stepDone();
			}
		});
	} else {
		stepDone();
	}
}