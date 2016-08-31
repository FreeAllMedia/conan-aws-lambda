"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _conanAwsLambda = require("./components/conanAwsLambda.js");

var _conanAwsLambda2 = _interopRequireDefault(_conanAwsLambda);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ConanAwsLambdaPlugin = function ConanAwsLambdaPlugin(conan) {
	_classCallCheck(this, ConanAwsLambdaPlugin);

	conan.config.region = conan.config.region || "us-east-1";
	conan.config.basePath = conan.config.basePath || process.cwd();

	conan.component("lambda", _conanAwsLambda2.default);

	conan.properties("region");

	conan.region("us-east-1");
};

exports.default = ConanAwsLambdaPlugin;