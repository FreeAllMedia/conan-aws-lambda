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
				})
				.post("/greetings")
				.headers("Content-Type")
				.lambda("postGreeting", "staging")
				.statusCodes({
					"200": "",
					"400": "Insufficient parameters.*"
				})
				.responseHeaders({
					"Allow-Control-Allow-Origin": "*"
				})
				.options("/greetings")
				.responseHeaders({
					"Allow-Control-Allow-Origin": "*",
					"Allow-Control-Allow-Methods": "*"
				});
}
