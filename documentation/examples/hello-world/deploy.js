import conan from "./conan.config.js";

const helloWorld = conan.lambda("HelloWorld");

helloWorld
		.description("A simple lambda that replies with 'Hello, World!'")
		.filePath("lambdas/helloWorld.js")
		.role("MyLambdaRole");

console.log("Deploy starting!");
conan.deploy(error => {
	if (error) { throw error; }
	console.log("Deploy complete!");

	console.log("Invoking HelloWorld Lambda");
	helloWorld.invoke({}, error, data => {
		console.log("HelloWorld Response:", data);
	});
});
