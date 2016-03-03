import conan from "./conan.config.js";
import packageJson from "./package.json";

const currentTime = conan.lambda("CurrentTime");

currentTime
	.description("A simple lambda that replies with the current time!")
	.filePath("lambdas/currentTime.js")
	.role("MyLambdaRole")
	.packages(packageJson.dependencies);

conan.deploy(error => {
	if (error) { throw error; }

	currentTime.invoke({}, (invokeError, data) => {
		if (invokeError) { throw invokeError; }
		console.log("The current time is:", data.payload);
	});
});
