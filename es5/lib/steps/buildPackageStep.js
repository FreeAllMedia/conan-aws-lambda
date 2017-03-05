"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = buildPackageStep;
function buildPackageStep(conan, context, stepDone) {
	var conanAwsLambda = context.parameters;

	if (conanAwsLambda.packages() !== undefined) {
		var akiro = new context.libraries.Akiro({
			region: conan.config.region,
			bucket: conan.config.bucket
		});

		var tempZipDirectoryPath = context.temporaryDirectoryPath + "/packages";

		akiro.package(conanAwsLambda.packages(), tempZipDirectoryPath, function (akiroError) {
			if (akiroError) {
				stepDone(akiroError);
			} else {
				stepDone(null, {
					packagesDirectoryPath: tempZipDirectoryPath
				});
			}
		});
	} else {
		stepDone(null, {
			packagesDirectoryPath: null
		});
	}
}