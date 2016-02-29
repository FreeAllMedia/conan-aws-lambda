![](../conan-aws-lambda-logo.png)
# [Getting Started](./gettingStarted.md): "Hello, World!" From Scratch

In this section we're going to create a deployment strategy for the following "Hello, World!" AWS Lambda handler:

``` javascript
exports.module = function handler(event, context) {
	context.succeed("Hello, World!");
};
```

## 1. Install `conan` and `conan-aws-lambda` from `npm`

``` shell
$ npm install conan conan-aws-lambda --save-dev
```

* *Note:* This uses the Node Package Manager to install `conan` and `conan-aws-lambda` to your project's `node_modules` directory.

## 2. Instantiate Conan and Use ConanAWSLambda

``` javascript
import Conan from "conan";
import ConanAwsLambda from "conan-aws-lambda";

conan = new Conan({
	region: "us-east-1"
});

conan.use(ConanAwsLambda);
```

* **Important:** `conan` itself is just a framework for making deployment systems and does not contain any AWS Lambda functionality on its own.
	* Remember to `.use(ConanAwsLambdaPlugin)` to enable AWS Lambda functionality.
* *Note:* You can name the file your deployment strategies reside in to anything you want.
	* You don't have to stick with `conan.js`.
	* As an example, you could use `deploy.js`.

## 3. Designate a Lambda Deployment Strategy

``` javascript
conan
	.lambda("HelloWorld")
		.description("A simple 'Hello, World!' example!"),
		.filePath(`helloWorld.js`)
		.role("MyIamRoleName");
```

* Above, we designate a deployment strategy for a Lambda named "HelloWorld".
	* It is to be deployed to AWS region "us-east-1".
	* It is to use the `helloWorld.js` file in `lambdas/` as the handler function.
	* Because no `.handler(name)` was provided, a default handler name ("handler") will be used.
	* The Lambda will be given the AWS Iam role that matches the name "MyIamRoleName".
	* The Lambda's description will be set.


## 4. Tell Conan to Deploy

* Use `conan.deploy(callback)` when you are ready to finally deploy using the strategies designated before.

``` javascript
console.log("Deploy beginning...");
conan.deploy(error => {
	if (error) { throw error; }
	console.log("Deploy complete!");
});
```

## 5. All Together Now

The final "Hello, World!" deployment strategy file should look something like this:

``` javascript
import Conan from "conan";
import ConanAwsLambda from "conan-aws-lambda";

conan = new Conan({
	region: "us-east-1"
});

conan.use(ConanAwsLambda);

conan
	.lambda("HelloWorld")
		.description("A simple 'Hello, World!' example!")
		.filePath(`helloWorld.js`)
		.role("MyIamRoleName");

console.log("Deploy beginning...");
conan.deploy(error => {
	if (error) { throw error; }
	console.log("Deploy complete!");
});
```

---

* [Back to Getting Started](./gettingStarted.md)
* [Back to README](../README.md)
