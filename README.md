![](./conan-aws-lambda-logo.png)
# conan-aws-lambda [![npm version](https://img.shields.io/npm/v/conan-aws-lambda.svg)](https://www.npmjs.com/package/conan-aws-lambda) [![license type](https://img.shields.io/npm/l/conan-aws-lambda.svg)](https://github.com/FreeAllMedia/conan-aws-lambda.git/blob/master/LICENSE) [![bitHound Score](https://www.bithound.io/github/FreeAllMedia/conan-aws-lambda/badges/score.svg)](https://www.bithound.io/github/FreeAllMedia/conan-aws-lambda) [![Coverage Status](https://coveralls.io/repos/FreeAllMedia/conan-aws-lambda/badge.svg)](https://coveralls.io/r/FreeAllMedia/conan-aws-lambda) [![npm downloads](https://img.shields.io/npm/dm/conan-aws-lambda.svg)](https://www.npmjs.com/package/conan-aws-lambda) ![ECMAScript 6 & 5](https://img.shields.io/badge/ECMAScript-6%20/%205-red.svg) [![Build Status](https://travis-ci.org/FreeAllMedia/conan-aws-lambda.png?branch=master)](https://travis-ci.org/FreeAllMedia/conan-aws-lambda)   [![Dependency Status](https://david-dm.org/FreeAllMedia/conan-aws-lambda.png?theme=shields.io)](https://david-dm.org/FreeAllMedia/conan-aws-lambda?theme=shields.io) [![Dev Dependency Status](https://david-dm.org/FreeAllMedia/conan-aws-lambda/dev-status.svg)](https://david-dm.org/FreeAllMedia/conan-aws-lambda?theme=shields.io#info=devDependencies)

`conan-aws-lambda` is a barbarically simple, unobtrusive, unopinionated, convention-over-configuration deployment system for [AWS Lambda](https://aws.amazon.com/lambda/). With it you can code lambda functions any way you want, with any directory structure or filenames.

Additionally, `conan-aws-lambda` comes with key integrations and advanced features such as remote package building (for architectural compatibility with compilers) and dependency management.

1. Installation
2. Quality and Compatibility
3. Features
	* AWS API Gateway Integration
	* Akiro.js Integration
	* Name-Based IamARN Referencing
	* Deploy Other Runtimes

# Installation

Conan can be installed as an npm development dependency with a single terminal command:

``` shell
$ npm install conan --save-dev
```

[![node 5.x.x](https://img.shields.io/badge/node-5.x.x-brightgreen.svg)](https://travis-ci.org/FreeAllMedia/conan-aws-lambda) [![node 4.x.x](https://img.shields.io/badge/node-4.x.x-brightgreen.svg)](https://travis-ci.org/FreeAllMedia/conan-aws-lambda) [![node 3.x.x](https://img.shields.io/badge/node-3.x.x-brightgreen.svg)](https://travis-ci.org/FreeAllMedia/conan-aws-lambda) [![iojs 2.x.x](https://img.shields.io/badge/iojs-2.x.x-brightgreen.svg)](https://travis-ci.org/FreeAllMedia/conan-aws-lambda) [![iojs 1.x.x](https://img.shields.io/badge/iojs-1.x.x-brightgreen.svg)](https://travis-ci.org/FreeAllMedia/conan-aws-lambda) [![node 0.12.x](https://img.shields.io/badge/node-0.12.x-brightgreen.svg)](https://travis-ci.org/FreeAllMedia/conan-aws-lambda) [![node 0.11.x](https://img.shields.io/badge/node-0.11.x-brightgreen.svg)](https://travis-ci.org/FreeAllMedia/conan-aws-lambda) [![node 0.10.x](https://img.shields.io/badge/node-0.10.x-brightgreen.svg)](https://travis-ci.org/FreeAllMedia/conan-aws-lambda)

*If your platform is not listed above, you can test your local environment for compatibility by copying and pasting the following commands into your terminal:*

```
npm install conan-aws-lambda
cd node_modules/conan-aws-lambda
npm test
```

# Getting Started

``` javascript
import Conan from "conan";
import ConanAwsLambdaPlugin from "conan-aws-lambda";

conan = new Conan({
	region: "us-east-1",
	bucket: "my-akiro-bucket"
});
conan.use(ConanAwsLambdaPlugin);

import packageJson from "./package.json";

conan
	.lambda("HelloWorld")
		.description("A simple 'Hello, World!' example!"),
		.filePath(`lambdas/helloWorld.js`)
		.role("MyIamRoleName") // Reference IamARNs by name!
		.dependencies("lib/**/*")
		.packages(packageJson.dependencies); // Builds remotely on AWS!
		//.handler("invoke") // Defaults to "handler"
		//.memorySize(256) // Defaults to 128
		//.runtime("python2.7") // Defaults to 'nodejs'
		//.timeout(60) // Defaults to 3
		//.alias("staging") // Defaults to null

conan.deploy(error => {
	if (error) { throw error; }
	console.log("Deploy complete!");
});
```

# **[AWS API Gateway](https://github.com/FreeAllMedia/conan-aws-api-gateway) Integration**

After your Lambda functions are deployed, you may want to use them via an HTTP interface such as REST. `conan-aws-lambda` and `conan-aws-api-gateway` have seamless integration with each other to provide name-based referencing.

**Note:** The [conan-aws-api-gateway](https://github.com/FreeAllMedia/conan-aws-api-gateway) project page has more thorough documentation about the plugin.

``` javascript
conan.use(ConanAwsLambdaPlugin);
conan.use(ConanAwsApiGatewayPlugin);

import packageJson from "./package.json";

conan
	.lambda("HelloWorld")
		.description("A simple 'Hello, World!' example!"),
		.filePath(`lambdas/helloWorld.js`)
		.role("MyIamRoleName")
		.dependencies("lib/**/*")
		.packages(packageJson.dependencies);
	.lambda("AccountCreate")
		.description("Create an Account."),
		.filePath(`lambdas/accountCreate.js`)
		.role("MyIamRoleName");

conan
	.api("MyAPI")
		.stage("production")
			.get("/helloWorld/{name}").lambda("HelloWorld")
			.post("/account").lambda("AccountCreate");


conan.deploy(error => {
	if (error) { throw error; }
	console.log("Deploy complete!");
});
```

# **[Akiro.js](https://github.com/FreeAllMedia/akiro) Integration**

`.packages(packageList)` provides seamless integration with `Akiro.js` so that packages are built on AWS instead of on your local development box. This ensures that any packages containing static/native code (such as C++ files) are always compiled with the correct architecture.

``` javascript
conan
	.lambda("HelloWorld")
		.filePath(`lambdas/helloWorld.js`)
		.role("MyIamRoleName")
		.packages(packageJson.dependencies); // Build packages on Lambda!
```

# **Name-Based IamARN Referencing**

IamARNs are long, complicated strings such as: "arn:aws:iam::156198161105:user/myusername". `conan-aws-lambda` lets you avoid the copy and paste involved with IamARNs by simply referencing them by name!

``` javascript
conan
	.lambda("HelloWorld")
		.filePath(`lambdas/helloWorld.js`)
		.role("MyIamRoleName"); // No IamARNs here!
```

# **Deploy Other Runtimes**

AWS Lambda supports Python 2.7 and Java 8 in addition to Node.js. `conan-aws-lambda` doesn't have to read your files, so it works with all other runtimes by default!

**Note:** at this time only `nodejs` (the default runtime) supports the `.package()` method.

``` javascript
conan
	.lambda("HelloWorld")
		.filePath(`lambdas/helloWorld.py`)
		.runtime("python2.7")
		.role("MyIamRoleName");
```





## Hello World Example

**Example project tree:**
``` shell
$ tree my-lambdas/
my-lambdas/
├── lambdas
│   └── helloWorld.js
├── conan.js
└── package.json
```

``` javascript
// lambdas/helloWorld.js
module.exports = function helloWorld(event, context) {
	context.succeed("Hello, " + event.name + "!");
}
```

``` javascript
// conan.js
import conan from "conan";
import ConanAwsLambdaPlugin from "conan-aws-lambda";

conan = new Conan();
conan.use(ConanAwsLambdaPlugin);

conan
	.lambda("HelloWorld")
		.filePath(`helloWorld.js`)
		.role("MyAmiRoleName");

conan.deploy(error => {
	if (error) { throw error; }
	console.log("Deploy complete!");
});
```







## Configuration

### AWS IAM Roles & Permissions

**Important:** In order for Conan AWS Lambda to work properly, you must provide an AWS IAM Role with sufficient permissions for:

* Creating more IAM Roles and set their permissions
* Full Access For AWS Lambda
* Full Access For AWS API Gateway
* Full Access For AWS S3



## Including Dependencies

In this example, we'll include extra file in addition to our lambda function, controlling their base and eventual zip paths:

**conan.js**

``` javascript
import conan from "conan";
import ConanAwsLambdaPlugin from "conan-aws-lambda";

conan = new Conan();
conan.use(ConanAwsLambdaPlugin);

conan
	.lambda("AccountCreate")
		.handler(`lambdas/accountCreate.js`)
			.role("AWSLambda")
		.dependencies(`{lib|node_modules}/**/*`)
		.dependencies(`../shared_modules/someModule/**/*`, {
			basePath: `../shared_modules/`,
			zipPath: `node_modules/`
		});

conan.deploy(error => {
	if (error) { throw error; }
	console.log("Deploy complete!");
});
```

## Including Packages

A common issue with using AWS Lambda is that native/static code (such as bundled C++ code), must be compiled directly on either an EC2 instance or within a lambda function itself, in order for the files to build against the correct processor architecture.

Conan AWS Lambda solves this issue by using `Akiro.js` to build dependent packages directly on AWS Lambda (in parallel), then send them back to be put into your lambda .zip file automatically. Additionally, `Akiro.js` caches your builds locally so that you only have to compile any version of a package once.

**conan.js**

``` javascript
import conan from "conan";
import ConanAwsLambdaPlugin from "conan-aws-lambda";

conan = new Conan();
conan.use(ConanAwsLambdaPlugin);

conan
	.lambda("AccountCreate")
		.handler(`lambdas/accountCreate.js`)
			.role("AWSLambda")
		.packages({
			"incognito": "^0.0.16",
			"dovima": "0.2.x"
		});

conan.deploy(error => {
	if (error) { throw error; }
	console.log("Deploy complete!");
});
```

# Changelog

* 0.1.0 - First BETA release for public review.

# How to Contribute

To contribute to the core Conan.js repository, you will need a firm understanding of:

* behavior-driven-development
* linting with `eslint`
* babel & transpiling

In order for a pull request to be accepted:

* All tests must pass.
* All tests must be meaningful.
* There must be 100% coverage for
