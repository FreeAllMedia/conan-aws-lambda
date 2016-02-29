import fileSystem from "fs";
import inflect from "jargon";
import archiver from "archiver";

export default function buildPackageStep(conan, context, stepDone) {
	const conanAwsLambda = context.parameters;

	if (conanAwsLambda.packages() !== undefined) {
		const lambdaName = conanAwsLambda.name();
		const packageZipFileName = `${inflect(lambdaName).camel.toString()}.packages.zip`;
		const packageZipFilePath = `${context.temporaryDirectoryPath}/zip/${packageZipFileName}`;

		const akiro = new context.libraries.Akiro({
			region: conan.config.region,
			bucket: conan.config.bucket
		});

		const tempZipDirectoryPath = `${context.temporaryDirectoryPath}/zip/`;

		akiro.package(conanAwsLambda.packages(), tempZipDirectoryPath, () => {
			//const zip = archiver.create("zip", {});
			//zip.directory(tempZipDirectoryPath);

			stepDone(null, {
				packageZipFilePath: packageZipFilePath
			});
		});
	} else {
		stepDone(null, {
			packageZipFilePath: null
		});
	}
}
