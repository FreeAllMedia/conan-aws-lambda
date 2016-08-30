export default function validateLambda(conan, lambda, stepDone) {
	if (lambda.role() === undefined) {
		const error = new Error(".role() is a required parameter for a lambda.");
		stepDone(error);
	} else if (lambda.packages() !== undefined && conan.config.bucket === undefined) {
		const error = new Error("conan.config.bucket is required to use .packages().");
		stepDone(error);
	} else {
		stepDone();
	}
}
