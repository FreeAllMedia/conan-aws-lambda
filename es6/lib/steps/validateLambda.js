export default function validateLambda(conan, context, stepDone) {
	const conanAwsLambda = context.parameters;
	if (conanAwsLambda.role() === undefined) {
		const error = new Error(".role() is a required parameter for a lambda.");
		stepDone(error);
	} else if (conanAwsLambda.packages() !== undefined && conan.config.bucket === undefined) {
		const error = new Error("conan.config.bucket is required to use .packages().");
		stepDone(error);
	} else {
		stepDone();
	}
}
