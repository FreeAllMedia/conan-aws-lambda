"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _conanAwsLambda = require("./components/conanAwsLambda.js");

var _conanAwsLambda2 = _interopRequireDefault(_conanAwsLambda);

var _awsSdk = require("aws-sdk");

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _akiro = require("akiro");

var _akiro2 = _interopRequireDefault(_akiro);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ConanAwsLambdaPlugin = function () {
	function ConanAwsLambdaPlugin(conan) {
		_classCallCheck(this, ConanAwsLambdaPlugin);

		conan.config.region = conan.config.region || "us-east-1";
		conan.config.basePath = conan.config.basePath || process.cwd();
		conan.lambdas = {};
		conan.lambda = this.lambda;
		conan.steps.library("AWS", _awsSdk2.default);
		conan.steps.library("Akiro", _akiro2.default);
	}

	_createClass(ConanAwsLambdaPlugin, [{
		key: "lambda",
		value: function lambda(name) {
			return new _conanAwsLambda2.default(this, name);
		}
	}]);

	return ConanAwsLambdaPlugin;
}();

exports.default = ConanAwsLambdaPlugin;