import conan from "./conan.config.js";

const helloWorld = conan.lambda("HelloWorld");

helloWorld
	.description("A simple lambda that replies with 'Hello, World!'")
	.filePath("lambdas/helloWorld.js")
	.role("MyLambdaRole");

conan.deploy(error => {
	if (error) { throw error; }
	helloWorld.invoke({}, error, response => {
		console.log(response.payload);
	});
});
