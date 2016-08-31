"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _conanAwsLambda = require("./components/conanAwsLambda.js");

var _conanAwsLambda2 = _interopRequireDefault(_conanAwsLambda);

var _awsSdk = require("aws-sdk");

var _awsSdk2 = _interopRequireDefault(_awsSdk);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ConanAwsLambdaPlugin = function ConanAwsLambdaPlugin(conan) {
	_classCallCheck(this, ConanAwsLambdaPlugin);

	conan.config.region = conan.config.region || "us-east-1";
	conan.config.basePath = conan.config.basePath || process.cwd();

	conan.component("lambda", _conanAwsLambda2.default);

	conan.properties("lambdaClient", "iamClient");

	conan.properties("region").then(function (newRegion) {
		// TODO: Add coverage for the AWS.Lambda config here.
		// Currently not possible without lots of extra work.
		// See: https://github.com/dwyl/aws-sdk-mock/issues/38
		conan.lambdaClient(new _awsSdk2.default.Lambda({ region: newRegion }));
		conan.iamClient(new _awsSdk2.default.IAM({ region: newRegion }));
	});

	conan.region("us-east-1");
};

exports.default = ConanAwsLambdaPlugin;