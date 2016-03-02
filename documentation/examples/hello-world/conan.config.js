// conan.config.js
import Conan from "conan";
import ConanAwsLambda from "conan-aws-lambda";

const conan = new Conan({
	region: "us-east-1",
	bucket: "my-akiro-packages"
});

conan.use(ConanAwsLambda);

export default conan;
