import Conan from "conan";
import ConanAwsLambda from "conan-aws-lambda";

new Conan().use(ConanAwsLambda)

.region("us-east-1")

.handler("invoke")

.packages({
	async: "^1.0.0"
})

.lambda("HelloWorld")
	.file("./functions/helloWorld.js")
	.packages({
		something: "^2.0.1"
	})
	.dependency("./lib/**/*").zipPath("blah")
	.dependency("./stuff/**/*").zipPath("blah")

.lambda("HelloPanda")
	.file("./functions/helloPanda.js")
	.handler("start")

.lambda("HelloPanda")
	.file("./functions/helloPanda.js");
