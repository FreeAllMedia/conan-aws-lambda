"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = validateLambda;
function validateLambda(conan, lambda, stepDone) {
	if (lambda.role() === null) {
		var error = new Error(".role() is a required parameter for a lambda.");
		stepDone(error);
	} else if (lambda.file() === null) {
		var _error = new Error(".file() is a required parameter to compile a lambda.");
		stepDone(_error);
	} else {
		stepDone();
	}
}