export default function defineFunctions(conan) {
	conan
		.lambda("regularGreeting")
		.filePath(`${__dirname}/../es5/lib/regularGreeting.js`)
		.role("AWSLambdaTest3")
		.alias("staging")
		.dependencies(`${__dirname}/../es5/lib/**/*`)
		.dependencies(`${__dirname}/../package.json`)
		.dependencies(`${__dirname}/../node_modules/{accept-language,bcp47}/**/*`);
	conan
		.lambda("postGreeting")
		.filePath(`${__dirname}/../es5/lib/postGreeting.js`)
		.role("AWSLambdaTest3")
		.alias("staging")
		.dependencies(`${__dirname}/../es5/lib/**/*`)
		.dependencies(`${__dirname}/../package.json`)
		.dependencies(`${__dirname}/../node_modules/{}/**/*`);
}
