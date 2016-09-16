import fileSystem from "fs";
import Async from "async";

export default function upsertLambda(conan, lambda, done) {
	Async.waterfall([
		Async.apply(readZipBuffer, lambda),
		Async.apply(performUpsert, lambda)
	], done);
}

function readZipBuffer(lambda, done) {
	fileSystem.readFile(lambda.zipPath(), done);
}

function performUpsert(lambda, zipBuffer, done) {
	const functionArn = lambda.functionArn();

	if (functionArn) {
		updateFunction(lambda, zipBuffer, done);
	} else {
		createFunction(lambda, zipBuffer, done);
	}
}

function createFunction(lambda, zipBuffer, done) {
	const parameters = {
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

	lambda.lambdaClient().createFunction(parameters, (error, data) => {
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
	Async.series([
		Async.apply(updateFunctionConfiguration, lambda),
		Async.apply(updateFunctionCode, lambda, zipBuffer)
	], done);
}

function updateFunctionConfiguration(lambda, done) {
	const updateConfigurationParameters = {
		FunctionName: lambda.name(),
		Handler: handlerString(lambda),
		Role: lambda.roleArn(),
		Description: lambda.description(),
		MemorySize: lambda.memorySize(),
		Timeout: lambda.timeout(),
		Runtime: lambda.runtime()
	};

	const lambdaClient = lambda.lambdaClient();

	lambdaClient.updateFunctionConfiguration(updateConfigurationParameters, done);
}

function updateFunctionCode(lambda, zipBuffer, done) {
	const parameters = {
		ZipFile: zipBuffer,
		FunctionName: lambda.name(),
		Publish: lambda.publish()
	};

	lambda.lambdaClient().updateFunctionCode(parameters, done);
}

function handlerString(lambda) {
	const handlerPath = lambda.file().match(/[\.\/]?(.*)\..*/)[1];
	const handlerName = lambda.handler();

	return `${handlerPath}.${handlerName}`;
}
