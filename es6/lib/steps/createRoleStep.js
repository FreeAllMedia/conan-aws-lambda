export default function createRoleStep(conan, context, stepDone) {
	if(!context.results.roleArn) {
		const AWS = context.libraries.AWS;
		const iam = new AWS.IAM({
			region: conan.config.region
		});

		iam.createRole({
			"RoleName": context.parameters.role(),
			"AssumeRolePolicyDocument": JSON.stringify({
					"Version": "2012-10-17",
					"Statement": {
						"Effect": "Allow",
						"Action": "sts:AssumeRole",
						"Principal": {
							"Service": "lambda.amazonaws.com"
						}
					}
				})
		}, (error, responseData) => {
			if (error) {
				stepDone(error);
			} else {
				console.log("IAM Lambda Role is new, we are creating it but we need to wait 5 seconds while the role is propagated by AWS... (this is a one time thing for each role)");
				setTimeout(() => {
					stepDone(null, {
						roleArn: responseData.Role.Arn
					});
				}, 5000);
			}
		});
	} else {
		stepDone();
	}
}
