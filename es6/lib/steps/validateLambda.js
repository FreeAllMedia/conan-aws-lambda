export default function validateLambda(conan, lambda, stepDone) {
	if (lambda.role() === null) {
		const error = new Error(".role() is a required parameter for a lambda.");
		stepDone(error);
	} else if (lambda.file() === null) {
		const error = new Error(".file() is a required parameter to compile a lambda.");
		stepDone(error);
	} else {
		stepDone();
	}
}
