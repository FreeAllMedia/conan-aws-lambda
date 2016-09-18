import Async from "async";

export default function upsertLambdaAlias(conan, lambda, done) {
	Async.eachSeries(
		lambda.aliases,
		Async.apply(createAlias, lambda),
		done
	);
}

function createAlias(lambda, alias, next) {
	const aliasName = alias[0];
	let functionVersion = lambda.version() || "$LATEST";

	let aliasExists;
	if (context.results.aliases) {
		aliasExists = context.results.aliases[aliasName];
	}

	if (!aliasExists) {
		lambda.lambdaClient.createAlias({
			"FunctionName": lambda.name(),
			"FunctionVersion": functionVersion,
			"Name": aliasName,
			"Description": alias.description()
		}, (error, responseData) => {
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
