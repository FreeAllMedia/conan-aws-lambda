"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = publishLambdaVersion;
function publishLambdaVersion(conan, lambda, stepDone) {
	lambda.iamClient().publishVersion({
		"FunctionName": lambda.name(),
		"Description": "conan autopublish step"
	}, function (error, responseData) {
		if (error) {
			stepDone(error);
		} else {
			lambda.version(responseData.Version);
			stepDone(null);
		}
	});
}