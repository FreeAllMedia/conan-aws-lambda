// conan.config.js
import Conan from "conan";
import ConanAwsLambda from "conan-aws-lambda";

const conan = new Conan({
	region: "us-east-1"
});

conan.use(ConanAwsLambda);

export default conan;
