import ConanAwsLambda from "./components/conanAwsLambda.js";

export default class ConanAwsLambdaPlugin {
	constructor (conan) {
		conan.config.region = conan.config.region || "us-east-1";
		conan.config.basePath = conan.config.basePath || process.cwd();

		conan.component("lambda", ConanAwsLambda);
	}
}
