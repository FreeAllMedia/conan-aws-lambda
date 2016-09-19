"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = upsertLambdaAlias;

var _async = require("async");

var _async2 = _interopRequireDefault(_async);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function upsertLambdaAlias(conan, lambda, done) {
	_async2.default.eachSeries(lambda.aliases, _async2.default.apply(upsertAlias, lambda), done);
}

function upsertAlias(lambda, alias, next) {
	var aliasExists = alias.arn() !== null;

	if (aliasExists) {
		updateAlias(lambda, alias, next);
	} else {
		createAlias(lambda, alias, next);
	}
}

function updateAlias(lambda, alias, done) {
	lambda.lambdaClient().updateAlias({
		"FunctionName": lambda.name(),
		"FunctionVersion": lambda.version() || "$LATEST",
		"Name": alias.name(),
		"Description": alias.description()
	}, done);
}

function createAlias(lambda, alias, done) {
	lambda.lambdaClient().createAlias({
		"FunctionName": lambda.name(),
		"FunctionVersion": lambda.version() || "$LATEST",
		"Name": alias.name(),
		"Description": alias.description()
	}, function (error, responseData) {
		if (!error) {
			alias.arn(responseData.AliasArn);
			done(null);
		} else {
			done(error);
		}
	});
}