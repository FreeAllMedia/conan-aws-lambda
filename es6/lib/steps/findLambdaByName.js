import AWS from "aws-sdk";

export default function findLambdaByName(conan, lambda, stepDone) {
	const awsLambda = new AWS.Lambda({
		region: conan.config.region
	});
	let lambdaName;
	if (typeof lambda.name === "function") {
		lambdaName = lambda.name();
	} else {
		lambdaName = lambda.lambda()[0];
	}

	if (lambdaName) {
		awsLambda.getFunction({
			"FunctionName": lambdaName
		}, (error, responseData) => {
			if (error && error.statusCode === 404) {
				stepDone(null, {
					lambdaArn: null
				});
			} else if (error) {
				stepDone(error);
			} else {
				stepDone(null, {
					lambdaArn: responseData.Configuration.FunctionArn
				});
			}
		});
	} else {
		stepDone(null, {
			lambdaArn: null
		});
	}
}
