import ConanAwsLambda from "./components/conanAwsLambda.js";
import AWS from "aws-sdk";
import privateData from "incognito";

export default class ConanAwsLambdaPlugin {
	constructor (conan) {
		const _ = privateData(this);
		_.conan = conan;

		conan.component("lambda", ConanAwsLambda);

		conan.properties(
			"lambdaClient",
			"iamClient",
			"basePath",
			"role",
			"bucket"
		);

		conan.properties(
			"region",
			"profile"
		).then(this.updateClients.bind(conan));

		conan
			.region("us-east-1")
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
