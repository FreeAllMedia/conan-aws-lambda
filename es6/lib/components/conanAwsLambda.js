import { ConanComponent } from "conan";

import findLambdaByNameStep from "../steps/findLambdaByNameStep.js";
import findRoleByNameStep from "../steps/findRoleByNameStep.js";
import createRoleStep from "../steps/createRoleStep.js";
import attachRolePolicyStep from "../steps/attachRolePolicyStep.js";
import buildPackageStep from "../steps/buildPackageStep.js";
import compileLambdaZipStep from "../steps/compileLambdaZipStep.js";
import upsertLambdaStep from "../steps/upsertLambdaStep.js";
import publishLambdaVersionStep from "../steps/publishLambdaVersionStep.js";
import findLambdaAliasStep from "../steps/findLambdaAliasStep.js";
import createLambdaAliasStep from "../steps/createLambdaAliasStep.js";
import updateLambdaAliasStep from "../steps/updateLambdaAliasStep.js";
import validateLambdaStep from "../steps/validateLambdaStep.js";

export default class ConanAwsLambda extends ConanComponent {
	initialize(conan, name) {
		this.conan = conan;

		this.parameters(
			"name",
			"filePath",
			"runtime",
			"role",
			"description",
			"memorySize",
			"timeout",
			"publish",
			"bucket",
			"packages"
		);

		this.multipleValueParameters(
			"handler"
		);

		this.multipleValueAggregateParameters(
			"dependencies",
			"alias"
		);

		/**
		 * DEFAULT VALUES
		 */

		this.name(name);

		this.handler("handler");
		this.runtime("nodejs");
		this.memorySize(128);
		this.timeout(3);

		// attach steps to conan
		this.conan.steps.add(validateLambdaStep, this);
		this.conan.steps.add(findLambdaByNameStep, this);
		this.conan.steps.add(findRoleByNameStep, this);
		this.conan.steps.add(createRoleStep, this);
		this.conan.steps.add(attachRolePolicyStep, this);
		this.conan.steps.add(buildPackageStep, this);
		this.conan.steps.add(compileLambdaZipStep, this);
		this.conan.steps.add(upsertLambdaStep, this);
		this.conan.steps.add(publishLambdaVersionStep, this);
		this.conan.steps.add(findLambdaAliasStep, this);
		this.conan.steps.add(createLambdaAliasStep, this);
		this.conan.steps.add(updateLambdaAliasStep, this);
	}

	lambda(name) {
		return this.conan.lambda(name);
	}

	invoke(payload, callback) {
		if (this.conan.config.region === undefined) {
			const error = new Error("conan.config.region is required to use .invoke().");
			callback(error);
		} else {
			const AWS = this.conan.steps.libraries.AWS;

			const lambda = new AWS.Lambda({
				region: this.conan.config.region
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
