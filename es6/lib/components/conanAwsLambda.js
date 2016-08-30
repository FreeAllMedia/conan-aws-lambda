import { ConanComponent } from "conan";

import findLambdaByName from "../steps/findLambdaByName.js";
import findRoleByName from "../steps/findRoleByName.js";
import createRole from "../steps/createRole.js";
import attachRolePolicy from "../steps/attachRolePolicy.js";
import buildPackage from "../steps/buildPackage.js";
import compileLambdaZip from "../steps/compileLambdaZip.js";
import upsertLambda from "../steps/upsertLambda.js";
import publishLambdaVersion from "../steps/publishLambdaVersion.js";
import findLambdaAlias from "../steps/findLambdaAlias.js";
import createLambdaAlias from "../steps/createLambdaAlias.js";
import updateLambdaAlias from "../steps/updateLambdaAlias.js";
import validateLambda from "../steps/validateLambda.js";

import AWS from "aws-sdk";
import privateData from "incognito";

export default class ConanAwsLambda extends ConanComponent {
	initialize(conan, name) {
		this.properties(
			"name",
			"filePath",
			"runtime",
			"role",
			"description",
			"memorySize",
			"timeout",
			"publish",
			"bucket",
			"packages",
			"roleArn",
			"functionArn"
		);

		this.properties(
			"handler"
		).multi;

		this.properties(
			"dependencies",
			"alias"
		).multi.aggregate;

		/**
		 * DEFAULT VALUES
		 */
		this.name(name);
		this.handler("handler");
		this.runtime("nodejs");
		this.memorySize(128);
		this.timeout(3);

		conan.series(
			validateLambda,
			findLambdaByName,
			findRoleByName,
			createRole,
			attachRolePolicy,
			buildPackage,
			compileLambdaZip,
			upsertLambda,
			publishLambdaVersion,
			findLambdaAlias,
			createLambdaAlias,
			updateLambdaAlias
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
}
