![](../conan-aws-lambda-logo.png)
# [Getting Started](./gettingStarted.md): Components and Conan Notation

Components are the objects returned by all top-level `conan` plugin methods such as `.lambda(name)`. Each component has getter/setter methods for each of its `component parameters`. Each component can also create further components of the same type by chaining calls. Together, these rules allow for a peculiar-looking, tab-based `conan notation` in which each tab-level notes when an object is returnable:

``` javascript
conan
	.lambda("MyLambda")
		.filePath("myLambda.js")
		.description("This is my lambda!")
	.lambda("AnotherLambda")
		.filePath("anotherLambda.js")
		.description("This is another lambda!");

conan.components.lambdas.forEach(lambda => {
	lambda
		.role("MyIamRoleName")
		.memorySize(256);
});
```

The same code can be also written using vanilla notation which better exposes the modular structure of conan plugins:

``` javascript
const myLambda = conan.lambda("MyLambda");
myLambda.filePath("myLambda.js");
myLambda.description("This is my lambda!");

const anotherLambda = conan.lambda("AnotherLambda");
anotherLambda.filePath("anotherLambda.js");
anotherLambda.description("This is another lambda!");

conan.components.lambdas.forEach(lambda => {
	lambda.role("MyIamRoleName");
	lambda.memorySize(256);
});
```

It can also be written by chaining the `component parameter` methods on a single `component`:

``` javascript
const myLambda = conan.lambda("MyLambda");
myLambda
	.filePath("myLambda.js");
	.description("This is my lambda!");

const anotherLambda = conan.lambda("AnotherLambda");
anotherLambda
	.filePath("anotherLambda.js");
	.description("This is another lambda!");

conan.components.lambdas.forEach(lambda => {
	lambda
		.role("MyIamRoleName");
		.memorySize(256);
});
```

**The choice of notation is yours.** `conan notation` is *not required*. It's just there if you happen to find it useful.

We find that the vanilla notation offers better portability of components in cases where we want to automate conan tasks, while `conan notation` makes it easy to designate a lot of information in a small, highly-readable form.

---

* [Back to Getting Started](./gettingStarted.md)
* [Back to README](../README.md)
