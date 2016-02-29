"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = buildPackageStep;

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _jargon = require("jargon");

var _jargon2 = _interopRequireDefault(_jargon);

var _archiver = require("archiver");

var _archiver2 = _interopRequireDefault(_archiver);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function buildPackageStep(conan, context, stepDone) {
	var conanAwsLambda = context.parameters;

	if (conanAwsLambda.packages() !== undefined) {
		(function () {
			var lambdaName = conanAwsLambda.name();
			var packageZipFileName = (0, _jargon2.default)(lambdaName).camel.toString() + ".packages.zip";
			var packageZipFilePath = context.temporaryDirectoryPath + "/" + packageZipFileName;

			var akiro = new context.libraries.Akiro({
				region: conan.config.region,
				bucket: conan.config.bucket
			});

			var tempZipDirectoryPath = context.temporaryDirectoryPath + "/zip/";

			akiro.package(conanAwsLambda.packages(), tempZipDirectoryPath, function () {
				//const zip = archiver.create("zip", {});
				//zip.directory(tempZipDirectoryPath);

				stepDone(null, {
					packageZipFilePath: packageZipFilePath
				});
			});
		})();
	} else {
		stepDone(null, {
			packageZipFilePath: null
		});
	}
}