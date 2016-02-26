import fileSystem from "fs";
import inflect from "jargon";

export default function buildPackageStep(conan, context, stepDone) {
	const conanAwsLambda = context.parameters;

	if (conanAwsLambda.packages() !== undefined) {
		const lambdaName = conanAwsLambda.name();
		const packageZipFileName = `${inflect(lambdaName).camel.toString()}.packages.zip`;
		const packageZipFilePath = `${context.temporaryDirectoryPath}/${packageZipFileName}`;

		const akiro = new context.libraries.Akiro({
			region: conan.config.region,
			bucket: conan.config.bucket
		});

		akiro.package(conanAwsLambda.packages(), context.)

		stepDone(null, {
			packageZipFilePath: packageZipFilePath
		});
	} else {
		stepDone(null, {
			packageZipFilePath: null
		});
	}
}
