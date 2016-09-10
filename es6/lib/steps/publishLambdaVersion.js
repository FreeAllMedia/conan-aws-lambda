export default function publishLambdaVersion(conan, lambda, stepDone) {
	lambda.iamClient().publishVersion({
		"FunctionName": lambda.name(),
		"Description": "conan autopublish step"
	}, (error, responseData) => {
		if (error) {
			stepDone(error);
		} else {
			lambda.version(responseData.Version);
			stepDone(null);
		}
	});
}
