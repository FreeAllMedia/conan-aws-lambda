import conan from "./conan.config.js";

conan
	.lambda("HelloWorld")
		.description("A simple lambda that replies with 'Hello, World!'")
		.filePath("lambdas/helloWorld.js")
		.role("MyLambdaRole");

console.log("Deploy starting!");
conan.deploy(error => {
	if (error) { throw error; }
	console.log("Deploy complete!");
});
