![](../conan-aws-lambda-logo.png)
# [Getting Started](./gettingStarted.md): Working With Aliases

Lambda "aliases" are pointers to a specific version of a Lambda function. The function that the alias is pointing to can change, so they are useful for things such as designating deployment environments such as "development", "staging", and "production".

To designate an alias when deploying a lambda, simply add the `.alias(name)` parameter to the lambda call:

``` javascript
conan
	.lambda("MyLambda")
		.filePath("myLambda.js")
		.alias("development");
```

---

* [Back to Getting Started](./gettingStarted.md)
* [Back to README](../README.md)
