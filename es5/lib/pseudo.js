import Conan from "conan";
import ConanAwsLambda from "conan-aws-lambda";

const conan = new Conan().use(ConanAwsLambda);

conan
	.region("us-east-1")
	.lambda("HelloWorld")
		.
