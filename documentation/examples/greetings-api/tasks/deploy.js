import gulp from "gulp";
import Conan from "conan";
import ConanAwsLambda from "conan-aws-lambda";
import ConanAwsApiGateway from "conan-aws-api-gateway";
import defineFunctions from "./defineFunctions.js";
import defineResources from "./defineResources.js";

gulp.task("deploy", ["build"], () => {
	const conan = new Conan({
		region: "us-east-1",
		bucket: "my-akiro-packages"
	});

	conan.use(ConanAwsLambda);
	conan.use(ConanAwsApiGateway);

	defineFunctions(conan);
	defineResources(conan);

	conan.deploy(error => {
		if (error) { throw error; }
		console.log("Deploy complete!");
	});
});