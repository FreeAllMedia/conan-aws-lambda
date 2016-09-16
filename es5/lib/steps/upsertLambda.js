"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = upsertLambda;

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _async = require("async");

var _async2 = _interopRequireDefault(_async);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function upsertLambda(conan, lambda, done) {
	_async2.default.waterfall([_async2.default.apply(readZipBuffer, lambda), _async2.default.apply(performUpsert, lambda)], done);
}

function readZipBuffer(lambda, done) {
	_fs2.default.readFile(lambda.zipPath(), done);
}

function performUpsert(lambda, zipBuffer, done) {
	var functionArn = lambda.functionArn();

	if (functionArn) {
		updateFunction(lambda, zipBuffer, done);
	} else {
		createFunction(lambda, zipBuffer, done);
	}
}

function createFunction(lambda, zipBuffer, done) {
	var parameters = {
		FunctionName: lambda.name(),
		Handler: handlerString(lambda),
		Role: lambda.roleArn(),
		Description: lambda.description(),
		MemorySize: lambda.memorySize(),
		Timeout: lambda.timeout(),
		Runtime: lambda.runtime(),
		Code: {
			ZipFile: zipBuffer
		}
	};

	lambda.lambdaClient().createFunction(parameters, function (error, data) {
		if (error) {
			console.log("WTF", error);
			done(error);
		} else {
			lambda.functionArn(data.FunctionArn);
			done(null);
		}
	});
}

function updateFunction(lambda, zipBuffer, done) {
	_async2.default.series([_async2.default.apply(updateFunctionConfiguration, lambda), _async2.default.apply(updateFunctionCode, lambda, zipBuffer)], done);
}

function updateFunctionConfiguration(lambda, done) {
	var updateConfigurationParameters = {
		FunctionName: lambda.name(),
		Handler: handlerString(lambda),
		Role: lambda.roleArn(),
		Description: lambda.description(),
		MemorySize: lambda.memorySize(),
		Timeout: lambda.timeout(),
		Runtime: lambda.runtime()
	};

	var lambdaClient = lambda.lambdaClient();

	lambdaClient.updateFunctionConfiguration(updateConfigurationParameters, done);
}

function updateFunctionCode(lambda, zipBuffer, done) {
	var parameters = {
		ZipFile: zipBuffer,
		FunctionName: lambda.name(),
		Publish: lambda.publish()
	};

	lambda.lambdaClient().updateFunctionCode(parameters, done);
}

function handlerString(lambda) {
	var handlerPath = lambda.file().match(/[\.\/]?(.*)\..*/)[1];
	var handlerName = lambda.handler();

	return handlerPath + "." + handlerName;
}