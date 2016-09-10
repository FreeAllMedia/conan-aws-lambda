"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = attachRolePolicy;
function attachRolePolicy(conan, lambda, done) {
	lambda.iamClient().attachRolePolicy({
		"RoleName": lambda.role(),
		"PolicyArn": "arn:aws:iam::aws:policy/AWSLambdaExecute"
	}, function (error) {
		if (error) {
			done(error);
		} else {
			done();
		}
	});
}