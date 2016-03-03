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

var _glob = require("glob");

var _glob2 = _interopRequireDefault(_glob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function buildPackageStep(conan, context, stepDone) {
	var conanAwsLambda = context.parameters;

	if (conanAwsLambda.packages() !== undefined) {
		(function () {
			var lambdaName = conanAwsLambda.name();
			var packageZipFileName = (0, _jargon2.default)(lambdaName).camel.toString() + ".packages.zip";

			var akiro = new context.libraries.Akiro({
				region: conan.config.region,
				bucket: conan.config.bucket
			});

			var tempZipDirectoryPath = context.temporaryDirectoryPath + "/zip";

			akiro.package(conanAwsLambda.packages(), tempZipDirectoryPath, function (akiroError) {
				if (akiroError) {
					stepDone(akiroError);
				} else {
					stepDone(null, {
						packagesDirectoryPath: tempZipDirectoryPath
					});
				}
			});
		})();
	} else {
		stepDone(null, {
			packageZipFilePath: null
		});
	}
}