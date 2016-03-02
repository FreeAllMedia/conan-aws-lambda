![](../conan-aws-lambda-logo.png)
# [Getting Started](./gettingStarted.md): Including Dependencies

Most of the time, there are going to be files other than your handler that you'll need to include in your Lambda. Thankfully, `conan-aws-lambda` makes dependencies a breeze:

``` javascript
conan
	.lambda("MyLambda")
		.filePath("myLambda.js")
		.dependencies("lib/**/*")
		.dependencies("node_modules/**/*");
```

## GLOBs
`conan-aws-lambda` uses [`glob`](https://github.com/isaacs/node-glob) strings to match dependency file paths.

* [`If you're new to glob strings, click here for a primer.`](https://github.com/isaacs/node-glob#glob-primer)

## Base Paths

The `base path` is the portion of the file path that is removed prior to being added to the zip file. By default, `conan-aws-lambda` uses your `current working directory` (the directory that you executed the script from) as the `base path`.

### Base Paths Examples

Follow along through the following steps to see how `base paths` affect the file paths that are put into your `Lambda Zip Files`.

#### Not Setting a `base path` (Using the `Current Working Directory`)

Let's look at the difference between using the default `base path` and using a custom `base path` by analyzing the difference between the file paths that are generated *inside* of the `Lambda Zip File`:

1. **If we execute the `conan.js` file from the `/home/bob/myProject/` directory**:
	* `conan` will automatically set the `base path` to `/home/bob/myProject/`, provided there are no overrides:
	* This will result in the following file paths being added to the lambda zip, because the `base path` (`/home/bob/myProject`) is removed from the file paths that are added to the zip file:
		``` shell
		myLambda.zip
		├── lib
		│	└── myLibrary.js
		└── lambdas
				└── myLambda.js
		```

2. **If we execute the `conan.js` file from the `/home/bob/` directory**
	* If we have not set a global or individual base path.
	* Because the `base path` is now `/home/bob/`, only that part of the file path is removed from the files added to the `Lambda Zip File`:
		``` shell
		myLambda.zip
		├── myLambda
		│	└── lib
		│		└── myLibrary.js
		└── lambdas
				└── myLambda.js
		```

### Setting a Global Base Path

If you want to set a default `base path` for all of your `.depenencies()` calls, you can pass in the `basePath` option with the global conan configuration:

``` javascript
const conan = new Conan({
	basePath: "/whatever/you/want/here/"
});
```

* This will make sure that the `base path` is always the same, even when the script is called from another directory.

### Setting an Individual Base Path

If you'd like to set the `base path` for a specific `.depenencies()` call, you can send the `base path` in via the `basePath` option on the second parameter:

``` javascript
conan
	.lambda("myLambda")
		.filePath("myLambda.js")
		.dependencies("build/**/*", {
			basePath: "/home/bob/myProject/"
		});
```

* This will override even a custom global `base path`, so you can set `basePath` in the global `conan` config as a general setting, and exceptions on a case-by-case basis with `.depenencies()`.

## Zip Paths

After the `base path` is removed from the files, you may want to reposition them within the in the `Lambda Zip`. You can achieve this by prepending a `zip path` to each file paths in the zip file:

``` javascript
const conan = new Conan({
	basePath: "/home/bob/myProject/"
});

conan
	.lambda("myLambda")
		.dependencies("lib/**/*", {
			zipPath: "myZipPath"
		});
```

Which will result in the following file paths within the `Lambda Zip File`:

``` shell
myLambda.zip
├── myZipPath
│	└── lib
│		└── myLibrary.js
└── lambdas
		└── myLambda.js
```

---

* [Back to Getting Started](./gettingStarted.md)
* [Back to README](../README.md)
