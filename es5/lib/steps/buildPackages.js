"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = buildPackages;

var _temp = require("temp");

var _temp2 = _interopRequireDefault(_temp);

var _async = require("async");

var _async2 = _interopRequireDefault(_async);

var _child_process = require("child_process");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function buildPackages(conan, lambda, stepDone) {
	if (lambda.packages()) {
		_async2.default.waterfall([makeTemporaryDirectory, initializeNPM, _async2.default.apply(buildWithNPM, lambda), setPackageDirectory], stepDone);
	} else {
		stepDone(null);
	}
}

function makeTemporaryDirectory(done) {
	_temp2.default.mkdir("buildPackage", done);
}

function initializeNPM(temporaryDirectoryPath, done) {
	(0, _child_process.exec)("cd " + temporaryDirectoryPath + ";npm init --yes", function (error) {
		return done(error, temporaryDirectoryPath);
	});
}

function buildWithNPM(lambda, temporaryDirectoryPath, done) {
	var packageStrings = [];

	var packages = lambda.packages();

	for (var packageName in packages) {
		var packageVersion = packages[packageName];
		packageStrings.push(packageName + "@" + packageVersion);
	}

	var packageString = packageStrings.join(" ");

	(0, _child_process.exec)("cd " + temporaryDirectoryPath + ";npm install " + packageString, function (error) {
		return done(error, lambda, temporaryDirectoryPath);
	});
}

function setPackageDirectory(lambda, temporaryDirectoryPath, done) {
	lambda.packagesDirectory(temporaryDirectoryPath + "/node_modules");
	done(null);
}