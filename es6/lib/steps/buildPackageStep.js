export default function buildPackageStep(conan, context, stepDone) {
	const conanAwsLambda = context.parameters;

	if (conanAwsLambda.packages() !== undefined) {
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
			packagesDirectoryPath: null
		});
	}
}
