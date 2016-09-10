![](./conan-aws-lambda-logo.png)
# conan-aws-lambda

[![npm version](https://img.shields.io/npm/v/conan-aws-lambda.svg)](https://www.npmjs.com/package/conan-aws-lambda) [![license type](https://img.shields.io/npm/l/conan-aws-lambda.svg)](https://github.com/FreeAllMedia/conan-aws-lambda.git/blob/master/LICENSE) [![bitHound Score](https://www.bithound.io/github/FreeAllMedia/conan-aws-lambda/badges/score.svg)](https://www.bithound.io/github/FreeAllMedia/conan-aws-lambda) [![Coverage Status](https://coveralls.io/repos/FreeAllMedia/conan-aws-lambda/badge.svg)](https://coveralls.io/r/FreeAllMedia/conan-aws-lambda) [![Build Status](https://travis-ci.org/FreeAllMedia/conan-aws-lambda.png?branch=master)](https://travis-ci.org/FreeAllMedia/conan-aws-lambda)   [![Dependency Status](https://david-dm.org/FreeAllMedia/conan-aws-lambda.png?theme=shields.io)](https://david-dm.org/FreeAllMedia/conan-aws-lambda?theme=shields.io)

`conan-aws-lambda` is a programmatic deployment system for [`AWS Lambda`](https://aws.amazon.com/lambda/).

* Seamless integration with [`AWS API Gateway`](https://aws.amazon.com/api-gateway/), [`AWS S3`](https://aws.amazon.com/s3/), and [`AWS IAM`](https://aws.amazon.com/iam/)
* Simple 100% tested codebase.
* No config files. Just pure javascript.

``` javascript
import Conan from "conan";
import ConanAwsLambda from "conan-aws-lambda";

new Conan().use(ConanAwsLambda)

.profile("deployment")
.basePath(__dirname) // defaults to process.cwd()

.role("LambdaRoleName")
	.lambda("HelloWorld")
		.description("A simple 'Hello, World!' example!")
		.filePath(`helloWorld.js`)

	.lambda("HelloUniverse")
		.description("A simple 'Hello, Universe!' example!")
		.filePath(`helloUniverse.js`)

.deploy(error => {
	if (error) { throw error; }
});
```

# Installation

Conan can be installed as an npm development dependency with the following command:

``` shell
$ npm install conan --save-dev
```

You can ensure compatibility with your system by running the automated tests after installation:

```
cd node_modules/conan-aws-lambda
npm test
cd -
```

# Configuration

**Your AWS credentials must be setup** *before* `conan-aws-lambda` will work!

AWS credentials can be provided in several ways.

* [Click here for a guide to setting up your AWS credentials](http://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html#Global_Configuration__AWS_config_)

## Setup Your Account's AWS IAM Roles & Permissions

The profile you use to deploy must have the following permissions:

* Permission to create IAM Roles and set their permissions
* Full Access For AWS Lambda
* Full Access For AWS API Gateway
* Full Access For AWS S3

# Changelog

* 0.0.0 - Open ALPHA (Bugs and missing functionality are expected.)
