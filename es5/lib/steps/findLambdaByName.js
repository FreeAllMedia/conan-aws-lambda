"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = findLambdaByName;
function findLambdaByName(conan, lambda, stepDone) {
	var lambdaName = lambda.name();

	if (lambdaName) {
		conan.lambdaClient().getFunction({
			"FunctionName": lambdaName
		}, function (error, responseData) {
			if (error && error.statusCode === 404) {
				stepDone();
			} else if (error) {
				stepDone(error);
			} else {
				lambda.arn(responseData.Configuration.FunctionArn);
				stepDone();
			}
		});
	} else {
		stepDone();
	}
}