export default function defineFunctions(conan) {
	conan
		.lambda("regularGreeting", `${__dirname}/../es5/lib/regularGreeting.js`, "AWSLambda")
		.alias("staging")
		.dependencies(`${__dirname}/../es5/lib/**/*`)
		.dependencies(`${__dirname}/../package.json`)
		.dependencies(`${__dirname}/../node_modules/{accept-language,bcp47}/**/*`);
}
