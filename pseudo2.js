import Conan from "conan";
import ConanAwsLambda from "conan-aws-lambda";

new Conan().use(ConanAwsLambda)

.region("us-east-1")
.alias("production")

.lambda("HelloWorld")
	.invoke({}, (error, responseData) => {

	})

.lambda("HelloWorld")
	.publish((error, versionNumber) => {

	})

.lambda("HelloWorld")
	.version("2")
	.invoke({}, (error, responseData) => {

	});
