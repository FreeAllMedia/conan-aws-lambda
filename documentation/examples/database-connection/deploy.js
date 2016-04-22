/* eslint-disable no-console */

import conan from "./conan.config.js";
import packageJson from "./package.json";

const credentialsDirectoryPath = "/Users/dcrockwell/.twitch/credentials/";

console.log("credentialsDirectoryPath", credentialsDirectoryPath);

const connectionTime = conan.lambda("ConnectionTime");

connectionTime
	.description("A lambda that tells us the database connection time!")
	.filePath("lambdas/connectionTime.js")
	.role("MyLambdaRole")
	.packages(packageJson.dependencies)
	.dependencies(
		`${credentialsDirectoryPath}mcsmike.mysql.json`,
		{
			basePath: credentialsDirectoryPath
		}
	);

conan.deploy(error => {
	if (error) { throw error; }
	connectionTime.invoke({}, (invokeError, data) => {
		if (invokeError) { throw invokeError; }
		console.log(data.payload);
	});
});

// import Async from "async";
// Async.times(40, () => {
// 	connectionTime.invoke({}, (invokeError, data) => {
// 		if (invokeError) { throw invokeError; }
// 		console.log(data.payload);
// 	});
// });
