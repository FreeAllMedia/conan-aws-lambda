"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = createLambdaAlias;

var _flowsync = require("flowsync");

var _flowsync2 = _interopRequireDefault(_flowsync);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createLambdaAlias(conan, context, stepDone) {
	var AWS = context.libraries.AWS;
	var iam = new AWS.Lambda({
		region: conan.config.region
	});

	var aliases = context.parameters.alias();
	var result = {};
	_flowsync2.default.eachSeries(aliases, function (alias, next) {
		var aliasName = alias[0];
		var aliasVersion = void 0;
		if (alias.length > 1) {
			aliasVersion = alias[1];
		} else {
			aliasVersion = "$LATEST";
		}

		var aliasExists = void 0;
		if (context.results.aliases) {
			aliasExists = context.results.aliases[aliasName];
		}

		if (!aliasExists) {
			iam.createAlias({
				"FunctionName": context.parameters.name(),
				"FunctionVersion": aliasVersion,
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
	}, function (error) {
		stepDone(error, { aliases: result });
	});
}