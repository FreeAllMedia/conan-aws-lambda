export default function findRoleByName(conan, lambda, stepDone) {
	conan.iamClient().getRole({
		"RoleName": lambda.role()
	}, (error, responseData) => {
		if (error && error.statusCode === 404) {
			stepDone();
		} else if (error) {
			stepDone(error);
		} else {
			lambda.roleArn(responseData.Role.Arn);
			stepDone();
		}
	});
}
