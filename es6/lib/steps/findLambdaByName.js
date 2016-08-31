import AWS from "aws-sdk";

export default function findLambdaByName(conan, lambda, stepDone) {
	// TODO: Add coverage for the AWS.Lambda config here.
	// Currently not possible without lots of extra work.
	// See: https://github.com/dwyl/aws-sdk-mock/issues/38
	const awsLambda = new AWS.Lambda({
		region: conan.config.region
	});

	let lambdaName = lambda.name();

	if (lambdaName) {
		awsLambda.getFunction({
			"FunctionName": lambdaName
		}, (error, responseData) => {
			if (error && error.statusCode === 404) {
				stepDone();
			} else if (error) {
				stepDone(error);
			} else {
				lambda.functionArn(responseData.Configuration.FunctionArn);
				stepDone();
			}
		});
	} else {
		stepDone();
	}
}
