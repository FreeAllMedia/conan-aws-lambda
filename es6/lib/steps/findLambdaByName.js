export default function findLambdaByName(conan, lambda, stepDone) {
	let lambdaName = lambda.name();

	if (lambdaName) {
		conan.lambdaClient().getFunction({
			"FunctionName": lambdaName
		}, (error, responseData) => {
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
