"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = createLambdaAlias;

var _async = require("async");

var _async2 = _interopRequireDefault(_async);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createLambdaAlias(conan, lambda, done) {
	_async2.default.eachSeries(lambda.aliases, _async2.default.apply(createAlias, lambda), done);
}

function createAlias(lambda, alias, next) {
	var aliasName = alias[0];
	var functionVersion = lambda.version() || "$LATEST";

	var aliasExists = void 0;
	if (context.results.aliases) {
		aliasExists = context.results.aliases[aliasName];
	}

	if (!aliasExists) {
		lambda.lambdaClient.createAlias({
			"FunctionName": lambda.name(),
			"FunctionVersion": functionVersion,
			"Name": aliasName,
			"Description": "conan auto created alias"
		}, function (error, responseData) {
			if (responseData) {
				result[aliasName] = {
					aliasArn: responseData.AliasArn,
					functionVersion: responseData.FunctionVersion
				};
				next();
			} else {
				next(error);
			}
		});
	} else {
		next();
	}
}