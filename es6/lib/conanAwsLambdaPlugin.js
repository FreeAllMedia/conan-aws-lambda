import ConanAwsLambda from "./components/conanAwsLambda.js";
import AWS from "aws-sdk";
import Akiro from "akiro";

export default class ConanAwsLambdaPlugin {
	constructor (conan) {
		conan.config.region = conan.config.region || "us-east-1";
		conan.config.basePath = conan.config.basePath || process.cwd();

		conan.steps.library("AWS", AWS);
		conan.steps.library("Akiro", Akiro);

		conan.addComponent("lambda", ConanAwsLambda);
	}
}
