# Conan-aws-api-gateway.js [![npm version](https://img.shields.io/npm/v/conan-aws-lambda.svg)](https://www.npmjs.com/package/conan-aws-lambda) [![license type](https://img.shields.io/npm/l/conan-aws-lambda.svg)](https://github.com/FreeAllMedia/conan-aws-lambda.git/blob/master/LICENSE) [![npm downloads](https://img.shields.io/npm/dm/conan-aws-lambda.svg)](https://www.npmjs.com/package/conan-aws-lambda) ![ECMAScript 6 & 5](https://img.shields.io/badge/ECMAScript-6%20/%205-red.svg)

Plugin for ["Conan: The Deployer"](https://github.com/FreeAllMedia/conan) to deploy Lambda functions to AWS.
Oftenly used with ["conan-aws-api-gateway"](https://github.com/FreeAllMedia/conan-aws-lambda) to get api resource support.

```javascript
import conan from "conan";
import ConanAwsLambdaPlugin from "conan-aws-lambda";

conan = new Conan();
conan.use(ConanAwsLambdaPlugin);

conan
	.lambda("accountCreate", `${__dirname}/../lib/lambdas/accounts/accountCreate.js`, "AWSLambda")
		.alias("staging")
		.dependencies(`${__dirname}/../lib/**/*`)
		.dependencies(`${__dirname}/../package.json`)
		.dependencies(`${__dirname}/../environment.json`)
		.dependencies(`${__dirname}/../node_modules/{flowsync,almaden}/**/*`);
```

# Quality and Compatibility

[![Build Status](https://travis-ci.org/FreeAllMedia/conan-aws-lambda.png?branch=master)](https://travis-ci.org/FreeAllMedia/conan-aws-lambda) [![Coverage Status](https://coveralls.io/repos/FreeAllMedia/conan-aws-lambda/badge.svg)](https://coveralls.io/r/FreeAllMedia/conan-aws-lambda)  [![bitHound Score](https://www.bithound.io/github/FreeAllMedia/conan-aws-lambda/badges/score.svg)](https://www.bithound.io/github/FreeAllMedia/conan-aws-lambda)  [![Dependency Status](https://david-dm.org/FreeAllMedia/conan-aws-lambda.png?theme=shields.io)](https://david-dm.org/FreeAllMedia/conan-aws-lambda?theme=shields.io) [![Dev Dependency Status](https://david-dm.org/FreeAllMedia/conan-aws-lambda/dev-status.svg)](https://david-dm.org/FreeAllMedia/conan-aws-lambda?theme=shields.io#info=devDependencies)

*Every build and release is automatically tested on the following platforms:*

![node 0.12.x](https://img.shields.io/badge/node-0.12.x-brightgreen.svg) ![node 0.11.x](https://img.shields.io/badge/node-0.11.x-brightgreen.svg) ![node 0.10.x](https://img.shields.io/badge/node-0.10.x-brightgreen.svg)
![iojs 2.x.x](https://img.shields.io/badge/iojs-2.x.x-brightgreen.svg) ![iojs 1.x.x](https://img.shields.io/badge/iojs-1.x.x-brightgreen.svg)



*If your platform is not listed above, you can test your local environment for compatibility by copying and pasting the following commands into your terminal:*

```
npm install conan-aws-lambda
cd node_modules/conan-aws-lambda
gulp test
```

# Installation

Copy and paste the following command into your terminal to install conan-aws-lambda:

```
npm install conan-aws-lambda --save-dev
```

# Getting Started


# How to Contribute

See something that could use improvement? Have a great feature idea? We listen!

You can submit your ideas through our [issues system](https://github.com/FreeAllMedia/conan-aws-lambda/issues), or make the modifications yourself and submit them to us in the form of a [GitHub pull request](https://help.github.com/articles/using-pull-requests/).

We always aim to be friendly and helpful.

## Running Tests

It's easy to run the test suite locally, and *highly recommended* if you're using conan-aws-lambda on a platform we aren't automatically testing for.

```
npm test
```
