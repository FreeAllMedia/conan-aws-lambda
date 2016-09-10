export default function attachRolePolicy(conan, lambda, done) {
	lambda.iamClient().attachRolePolicy({
		"RoleName": lambda.role(),
		"PolicyArn": "arn:aws:iam::aws:policy/AWSLambdaExecute"
	}, (error) => {
		if (error) {
			done(error);
		} else {
			done();
		}
	});
}
