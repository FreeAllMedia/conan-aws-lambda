![](../conan-aws-lambda-logo.png)
# [Getting Started](./gettingStarted.md): Usage With AWS API Gateway

After your lambdas have been deployed, you may want to expose them via an HTTP(s) interface. This can be accomplished using the `conan-aws-api-gateway` plugin in conjunction with `conan-aws-lambda`.

## Simple Example

**Notice:** You can reference your lambdas by name between the `conan-aws-lambda` and `conan-aws-api-gateway` plugins:

``` javascript
import Conan from "conan";
import ConanAwsLambda from "conan-aws-lambda";
import ConanAwsApiGateway from "conan-aws-api-gateway";

const conan = new Conan();
conan.use(ConanAwsLambda);
conan.use(ConanAwsApiGateway);

conan
	.lambda("AccountCreate")
		.filePath("lambdas/accountCreate.js")
	.lambda("AccountShow")
		.filePath("lambdas/accountShow.js");

conan
	.api("MyAPI")
		.stage("production")
			.post("/account")
				.lambda("AccountCreate")
			.get("/account/{id}")
				.lambda("AccountShow");
```

## Using Aliases w/ Conan AWS API Gateway

If you've setup your lambdas to use aliases, you can easily reference them from `conan-aws-api-gateway` by providing the name of the alias as the second argument to `.lambda()`:

``` javascript
conan
	.lambda("AccountCreate")
		.filePath("lambdas/prodAccountCreate.js")
		.alias("production")
	.lambda("AccountCreate")
		.filePath("lambdas/devAccountCreate.js")
		.alias("development");

conan
	.api("MyAPI")
		.stage("production")
			.post("/dev/account")
				.lambda("AccountCreate", "development")
			.post("/prod/account")
				.lambda("AccountCreate", "production");
```

## Status Codes

By default, `conan-aws-api-gateway` resources will always respond with a `200 (OK)` status code. To override this behavior and provide additional status codes, each `API Gateway Resource` can be given a set of status codes along with a substring matcher that matches the response to the code.

For example, you may want to use a `200 (OK)` status by default for all responses, while also returning a `500 (Error)` status whenever the response contains the substring `"Server Error: Account Invalid"`. You can accomplish this with the following deployment strategy:

``` javascript
conan
	.lambda("AccountCreate")
		.filePath("lambdas/accountCreate.js");

conan
	.api("MyAPI")
		.stage("production")
			.post("/myLambda")
				.lambda("AccountCreate")
				.statusCodes({
					200: "", // Blank matches everything
					500: "Server Error: Account Invalid"
				});
```

## Headers

You must designate the acceptable headers for your API resource. This can be done with the `.headers(...headerNames)` method.

``` javascript
conan
	.lambda("AccountCreate")
		.filePath("lambdas/accountCreate.js");

conan
	.api("MyAPI")
		.stage("production")
			.post("/myLambda")
				.lambda("AccountCreate")
				.headers(
					"Content-Type",
					"Custom-Header"
				);
```

## Response Headers

Sometimes, you may want to include certain response headers (such as the CORS response headers). You can accomplish this with the following deployment strategy:

``` javascript
conan
	.lambda("AccountCreate")
		.filePath("lambdas/accountCreate.js");

conan
	.api("MyAPI")
		.stage("production")
			.post("/myLambda")
				.lambda("AccountCreate")
				.responseHeaders({
					"Allow-Control-Allow-Origin": "*"
				});
```

---

* [Back to Getting Started](./gettingStarted.md)
* [Back to README](../README.md)
