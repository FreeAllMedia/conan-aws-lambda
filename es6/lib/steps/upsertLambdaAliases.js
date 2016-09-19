import Async from "async";

export default function upsertLambdaAlias(conan, lambda, done) {
	Async.eachSeries(
		lambda.aliases,
		Async.apply(upsertAlias, lambda),
		done
	);
}

function upsertAlias(lambda, alias, next) {
	const aliasExists = alias.arn() !== null;

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
	}, (error, responseData) => {
		if (!error) {
			alias.arn(responseData.AliasArn);
			done(null);
		} else {
			done(error);
		}
	});
}