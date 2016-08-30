"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = validateLambda;
function validateLambda(conan, lambda, stepDone) {
	if (lambda.role() === undefined) {
		var error = new Error(".role() is a required parameter for a lambda.");
		stepDone(error);
	} else if (lambda.packages() !== undefined && conan.config.bucket === undefined) {
		var _error = new Error("conan.config.bucket is required to use .packages().");
		stepDone(_error);
	} else {
		stepDone();
	}
}