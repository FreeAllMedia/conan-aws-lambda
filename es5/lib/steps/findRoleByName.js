"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = findRoleByName;
function findRoleByName(conan, lambda, stepDone) {
	conan.iamClient().getRole({
		"RoleName": lambda.role()
	}, function (error, responseData) {
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