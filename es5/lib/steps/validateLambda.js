"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = validateLambda;
function validateLambda(conan, lambda, stepDone) {
	if (lambda.role() === null) {
		var error = new Error(".role() is a required parameter for a lambda.");
		stepDone(error);
	} else {
		stepDone();
	}
}