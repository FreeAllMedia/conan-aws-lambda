"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = validateLambdaStep;
function validateLambdaStep(conan, context, stepDone) {
	var conanAwsLambda = context.parameters;
	if (conanAwsLambda.role() === undefined) {
		console.log("WTC");
		var error = new Error(".role() is a required parameter for a lambda.");
		stepDone(error);
	} else if (conanAwsLambda.packages() !== undefined && conan.config.bucket === undefined) {
		console.log("WTH");
		var error = new Error("conan.config.bucket is required to use .packages().");
		stepDone(error);
	} else {
		console.log("WTF");
		stepDone();
	}
}