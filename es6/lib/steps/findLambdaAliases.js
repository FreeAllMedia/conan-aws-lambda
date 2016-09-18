import Async from "async";

export default function findLambdaAliases(conan, lambda, done) {
	Async.eachSeries(lambda.aliases,
		Async.apply(getAlias, lambda),
		done
	);
}

function getAlias(lambda, alias, next) {
	lambda.lambdaClient().getAlias({
		"FunctionName": lambda.name(),
		"Name": alias.name()
	}, (error, responseData) => {
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
