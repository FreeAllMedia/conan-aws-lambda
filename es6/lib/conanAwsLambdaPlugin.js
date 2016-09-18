import ConanAwsLambda from "./conanAwsLambda.js";
import AWS from "aws-sdk";
import privateData from "incognito";
import Dependency from "./dependency.js";
import Alias from "./alias.js";

export default class ConanAwsLambdaPlugin {
	constructor (conan) {
		const _ = privateData(this);
		_.conan = conan;

		conan.properties(
			"lambdaClient",
			"iamClient",
			"basePath",
			"role",
			"bucket",
			"handler"
		);

		conan.properties(
			"region",
			"profile"
		).then(this.updateClients.bind(conan));

		conan.component("dependency", Dependency).into("dependencies");

		conan.component("alias", Alias).into("aliases");

		conan.component("lambda", ConanAwsLambda).inherit("dependencies", "aliases");

		conan
			.region("us-east-1")
			.handler("handler")
			.basePath(process.cwd());
	}

	updateClients() {
		// TODO: Add coverage for the AWS.Lambda config here.
		// Currently not possible without lots of extra work.
		// See: https://github.com/dwyl/aws-sdk-mock/issues/38
		const awsConfig = { region: this.region(), profile: this.profile() };

		this.lambdaClient(new AWS.Lambda(awsConfig));
		this.iamClient(new AWS.IAM(awsConfig));
	}
}
