import { ConanComponent } from "conan";

import findLambdaByName from "./steps/findLambdaByName.js";
import findRoleByName from "./steps/findRoleByName.js";
import createRole from "./steps/createRole.js";
import attachRolePolicy from "./steps/attachRolePolicy.js";
import buildPackages from "./steps/buildPackages.js";
import compileLambdaZip from "./steps/compileLambdaZip.js";
import upsertLambda from "./steps/upsertLambda.js";
import findLambdaAliases from "./steps/findLambdaAliases.js";
import upsertLambdaAliases from "./steps/upsertLambdaAliases.js";
import validateLambda from "./steps/validateLambda.js";

import AWS from "aws-sdk";
import privateData from "incognito";

import Dependency from "./dependency.js";
import Alias from "./alias.js";

export default class ConanAwsLambda extends ConanComponent {
	initialize(conan, name) {
		this.properties(
			"name",
			"file",
			"runtime",
			"role",
			"description",
			"memorySize",
			"timeout",
			"publish",
			"bucket",
			"packages",
			"packagesDirectory",
			"roleArn",
			"arn",
			"iamClient",
			"lambdaClient",
			"version",
			"bucket",
			"handler",
			"zipPath"
		);

		this.properties(
			"region",
			"profile"
		).then(this.updateClients);

		/**
		 * DEFAULT VALUES
		 */
		this.name(name || null);
		this.handler("handler");
		this.runtime("nodejs");
		this.memorySize(128);
		this.timeout(3);
		this.region(conan.region());
		this.publish(true);
		this.iamClient(conan.iamClient());
		this.lambdaClient(conan.lambdaClient());
		this.profile(conan.profile());
		this.role(conan.role());
		this.bucket(conan.bucket());
		this.handler(conan.handler());

		this.component("dependency", Dependency).into("dependencies");
		this.component("alias", Alias).into("aliases");

		conan.series(
			validateLambda,
			findLambdaByName,
			findRoleByName,
			createRole,
			attachRolePolicy,
			buildPackages,
			compileLambdaZip,
			upsertLambda,
			findLambdaAliases,
			upsertLambdaAliases
		).apply(this);

		privateData(this).conan = conan;
	}

	invoke(payload, callback) {
		const parameters = {
			FunctionName: this.name(),
			Payload: JSON.stringify(payload),
			InvocationType: "RequestResponse",
			LogType: "None"
		};

		this.lambdaClient().invoke(parameters, (error, data) => {
			if (error) {
				callback(error);
			} else {
				callback(null, {
					StatusCode: data.StatusCode,
					Payload: JSON.parse(data.Payload)
				});
			}
		});
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
