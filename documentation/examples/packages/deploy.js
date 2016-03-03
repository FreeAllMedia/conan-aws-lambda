import conan from "./conan.config.js";

const currentTime = conan.lambda("CurrentTime");

currentTime
	.description("A simple lambda that replies with the current time!")
	.filePath("lambdas/currentTime.js")
	.role("MyLambdaRole");

conan.deploy(error => {
	if (error) { throw error; }

	currentTime.invoke({}, error, data => {
		console.log("The current time is:", data);
	});
});
