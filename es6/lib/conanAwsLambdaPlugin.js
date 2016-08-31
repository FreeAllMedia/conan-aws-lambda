import ConanAwsLambda from "./components/conanAwsLambda.js";
import AWS from "aws-sdk";

export default class ConanAwsLambdaPlugin {
	constructor (conan) {
		conan.config.region = conan.config.region || "us-east-1";
		conan.config.basePath = conan.config.basePath || process.cwd();

		conan.component("lambda", ConanAwsLambda);

		conan.properties("lambdaClient", "iamClient");

		conan.properties("region").then(newRegion => {
			// TODO: Add coverage for the AWS.Lambda config here.
			// Currently not possible without lots of extra work.
			// See: https://github.com/dwyl/aws-sdk-mock/issues/38
			conan.lambdaClient(new AWS.Lambda({ region: newRegion }));
			conan.iamClient(new AWS.IAM({ region: newRegion }));
		});

		conan.region("us-east-1");
	}
}
