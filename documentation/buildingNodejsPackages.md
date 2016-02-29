![](../conan-aws-lambda-logo.png)
# [Getting Started](./gettingStarted.md): Building Node.js Packages

Sometimes you may want to use a package which contains static code (such as C, C++, etc.) that must be built on the system that it is going to run on. This can cause a lot of trouble when you rely on a specific version built for your development machine, then try to deploy it to AWS Lambda.

To get around this issue, `conan-aws-lambda` is integrated with [`Akiro.js`](https://github.com/FreeAllMedia/akiro) to build node.js packages remotely on the AWS Lambda architecture, then included into your `Lambda Zip File` automatically.

## Initializing Akiro.js

**IMPORTANT:** Before you can use `Akiro.js` or the `.packages()` command, you will need to initialize it within your AWS Lambda account. This deploys an `AkiroBuilder` Lambda function, which is used to remotely build your npm packages.

### Install Akiro

This will install `akiro` globally, which is the easiest way to initialize.

``` shell
$ npm install akiro -g
```

### Initialize Akiro

After you have installed `akiro` globally, run the following command to initialize:

``` shell
$ akiro initialize us-east-1
```

### After Akiro.js is Initialized

`akiro` only needs to be initialized once per AWS Lambda region that you plan on deploying Lambdas to. Everybody in the organization that uses `conan-aws-lambda` on those regions, will share the same `AkiroBuilder` function.

## Using Akiro.js With Conan AWS Lambda

`akiro` is seamlessly integrated into `conan-aws-lambda`. As long as `akiro` is initialized on the region your are deploying to, you can simply use the `.packages()` method to designate which packages should be built remotely.

``` javascript
include Conan from "conan";
include ConanAwsLambda from "conan-aws-lambda";
include packageJson from "./package.json";

const packages = packageJson.dependencies;
const conan = new Conan({
	region: "us-east-1",
	bucket: "my-akiro-builds"
});

conan
	.lambda("myLambda")
		.filePath("myLambda.js")
		.packages(packages);
```

**This will perform the following tasks in order:**

1. Resolve the version numbers for all package version ranges.
2. Invoke the `AkiroBuilder` lambda once per package in parallel, so that packages build in the fastest possible time.
3. Save the built package files to the S3 bucket you designate. (This is necessary, because AWS Lambda does not.)
4. Download the package files locally to a temporary directory.
5. Add the package files to your `Lambda Zip File` under its `node_modules` directory.
