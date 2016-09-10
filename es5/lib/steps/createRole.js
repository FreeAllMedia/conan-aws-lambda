"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = createRole;
function createRole(conan, lambda, stepDone) {
	if (!lambda.roleArn()) {
		lambda.iamClient().createRole({
			"RoleName": lambda.role(),
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
		}, function (error, responseData) {
			if (error) {
				stepDone(error);
			} else {
				lambda.roleArn(responseData.Role.Arn);
				stepDone();
			}
		});
	} else {
		stepDone();
	}
}