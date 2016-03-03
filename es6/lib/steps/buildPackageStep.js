import fileSystem from "fs";
import inflect from "jargon";
import archiver from "archiver";
import glob from "glob";

export default function buildPackageStep(conan, context, stepDone) {
	const conanAwsLambda = context.parameters;

	if (conanAwsLambda.packages() !== undefined) {
		const lambdaName = conanAwsLambda.name();
		const packageZipFileName = `${inflect(lambdaName).camel.toString()}.packages.zip`;

		const akiro = new context.libraries.Akiro({
			region: conan.config.region,
			bucket: conan.config.bucket
		});

		const tempZipDirectoryPath = `${context.temporaryDirectoryPath}/zip`;

		akiro.package(conanAwsLambda.packages(), tempZipDirectoryPath, akiroError => {
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
			packageZipFilePath: null
		});
	}
}
