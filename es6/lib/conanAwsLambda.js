import { ConanComponent } from "conan";

import findLambdaByName from "./steps/findLambdaByName.js";
import findRoleByName from "./steps/findRoleByName.js";
import createRole from "./steps/createRole.js";
import attachRolePolicy from "./steps/attachRolePolicy.js";
import buildPackages from "./steps/buildPackages.js";
import compileLambdaZip from "./steps/compileLambdaZip.js";
import upsertLambda from "./steps/upsertLambda.js";
import publishLambdaVersion from "./steps/publishLambdaVersion.js";
import findLambdaAlias from "./steps/findLambdaAlias.js";
import createLambdaAlias from "./steps/createLambdaAlias.js";
import updateLambdaAlias from "./steps/updateLambdaAlias.js";
import validateLambda from "./steps/validateLambda.js";

import AWS from "aws-sdk";
import privateData from "incognito";

import Dependency from "./dependency.js";

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
			"functionArn",
			"iamClient",
			"lambdaClient",
			"version",
			"bucket",
			"handler",
			"zipPath"
		);

		this.properties(
			"dependencies",
			"alias"
		).multi.aggregate;

		this.properties(
			"region",
			"profile"
		).then(this.updateClients);

		/**
		 * Components
		 */
		this.component("dependency", Dependency);

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

		conan.series(
			validateLambda,
			findLambdaByName,
			findRoleByName,
			createRole,
			attachRolePolicy,
			buildPackages
			// compileLambdaZip,
			// upsertLambda,
			// publishLambdaVersion,
			// findLambdaAlias,
			// createLambdaAlias,
			// updateLambdaAlias
		).apply(this);

		privateData(this).conan = conan;
	}

	invoke(payload, callback) {
		const conan = privateData(this);

		if (conan.config.region === undefined) {
			const error = new Error("conan.config.region is required to use .invoke().");
			callback(error);
		} else {
			const lambda = new AWS.Lambda({
				region: conan.config.region
			});

			const parameters = {
				FunctionName: this.name(),
				Payload: JSON.stringify(payload)
			};

			if (this.alias().length > 0) {
				parameters.Qualifier = this.alias();
			}

			lambda.invoke(parameters, (error, data) => {
				if (error) {
					callback(error);
				} else {
					callback(null, {
						statusCode: data.StatusCode,
						payload: JSON.parse(data.Payload)
					});
				}
			});
		}
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
