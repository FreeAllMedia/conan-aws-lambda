"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = findLambdaAliases;

var _async = require("async");

var _async2 = _interopRequireDefault(_async);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function findLambdaAliases(conan, lambda, done) {
	_async2.default.eachSeries(lambda.aliases, _async2.default.apply(getAlias, lambda), done);
}

function getAlias(lambda, alias, next) {
	lambda.lambdaClient().getAlias({
		"FunctionName": lambda.name(),
		"Name": alias.name()
	}, function (error, responseData) {
		if (!error) {
			alias.arn(responseData.AliasArn);
			next(null);
		} else {
			if (error.statusCode === 404) {
				next(null);
			} else {
				next(error);
			}
		}
	});
}