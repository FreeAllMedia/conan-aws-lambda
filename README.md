![](./conan-aws-lambda-logo.png)
# conan-aws-lambda [![npm version](https://img.shields.io/npm/v/conan-aws-lambda.svg)](https://www.npmjs.com/package/conan-aws-lambda) [![license type](https://img.shields.io/npm/l/conan-aws-lambda.svg)](https://github.com/FreeAllMedia/conan-aws-lambda.git/blob/master/LICENSE) [![bitHound Score](https://www.bithound.io/github/FreeAllMedia/conan-aws-lambda/badges/score.svg)](https://www.bithound.io/github/FreeAllMedia/conan-aws-lambda) [![Coverage Status](https://coveralls.io/repos/FreeAllMedia/conan-aws-lambda/badge.svg)](https://coveralls.io/r/FreeAllMedia/conan-aws-lambda) [![npm downloads](https://img.shields.io/npm/dm/conan-aws-lambda.svg)](https://www.npmjs.com/package/conan-aws-lambda) ![ECMAScript 6 & 5](https://img.shields.io/badge/ECMAScript-6%20/%205-red.svg) [![Build Status](https://travis-ci.org/FreeAllMedia/conan-aws-lambda.png?branch=master)](https://travis-ci.org/FreeAllMedia/conan-aws-lambda)   [![Dependency Status](https://david-dm.org/FreeAllMedia/conan-aws-lambda.png?theme=shields.io)](https://david-dm.org/FreeAllMedia/conan-aws-lambda?theme=shields.io) [![Dev Dependency Status](https://david-dm.org/FreeAllMedia/conan-aws-lambda/dev-status.svg)](https://david-dm.org/FreeAllMedia/conan-aws-lambda?theme=shields.io#info=devDependencies)

`conan-aws-lambda` is a barbarically simple deployment system for [`AWS Lambda`](https://aws.amazon.com/lambda/).

**Unobtrusive and Unopinionated**

Code lambda functions any way you want, with any directory structure, any filenames... then just tell `conan-aws-lambda` how you want it deployed:

``` javascript
// conan.config.js
import Conan from "conan";
import ConanAwsLambda from "conan-aws-lambda";

conan = new Conan({
	region: "us-east-1"
});

conan.use(ConanAwsLambda);
```

``` javascript
// deploy.js
import "./conan.config.js";

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


Featuring seamless integration with [`conan-aws-api-gateway`](https://github.com/FreeAllMedia/conan-aws-api-gateway) and [`akiro.js`]().


Additionally, `conan-aws-lambda` comes with key integrations and advanced features such as remote package building (for architectural compatibility with compilers) and dependency management.

[Getting Started Guide](./documentation/gettingStarted.md)


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

# Configuration

## AWS IAM Roles & Permissions

**Important:** In order for Conan AWS Lambda to work properly, you must provide an AWS IAM Role with sufficient permissions for:

* Creating more IAM Roles and set their permissions
* Full Access For AWS Lambda
* Full Access For AWS API Gateway
* Full Access For AWS S3

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
