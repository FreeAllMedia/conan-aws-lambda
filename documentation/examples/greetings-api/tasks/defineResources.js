export default function defineResources(conan) {
	conan
		.api("greetingsApi")
			.stage("staging")
				.get("/greetings/{age}")
				.queryStrings("name")
				.headers("Accept-Language", "Content-Type")
				.lambda("regularGreeting", "staging")
				.statusCodes({
					"200": "",
					"400": "Insufficient parameters.*"
				})
				.responseHeaders({
					"Allow-Control-Allow-Origin": "*"
				});
}
