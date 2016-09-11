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
	.dependencies("./lib/**/*").zipBase("blah")
	.dependencies("./stuff/**/*").zipBase("blah")

.lambda("HelloPanda")
	.file("./functions/helloPanda.js")
	.handler("start")

.lambda("HelloPanda")
	.file("./functions/helloPanda.js");
