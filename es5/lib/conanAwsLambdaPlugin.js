"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _conanAwsLambda = require("./conanAwsLambda.js");

var _conanAwsLambda2 = _interopRequireDefault(_conanAwsLambda);

var _awsSdk = require("aws-sdk");

var _awsSdk2 = _interopRequireDefault(_awsSdk);

var _incognito = require("incognito");

var _incognito2 = _interopRequireDefault(_incognito);

var _dependency = require("./dependency.js");

var _dependency2 = _interopRequireDefault(_dependency);

var _alias = require("./alias.js");

var _alias2 = _interopRequireDefault(_alias);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ConanAwsLambdaPlugin = function () {
	function ConanAwsLambdaPlugin(conan) {
		_classCallCheck(this, ConanAwsLambdaPlugin);

		var _ = (0, _incognito2.default)(this);
		_.conan = conan;

		conan.properties("lambdaClient", "iamClient", "basePath", "role", "bucket", "handler");

		conan.properties("region", "profile").then(this.updateClients.bind(conan));

		conan.component("dependency", _dependency2.default).into("dependencies");

		conan.component("alias", _alias2.default).into("aliases");

		conan.component("lambda", _conanAwsLambda2.default).inherit("dependencies", "aliases");

		conan.region("us-east-1").handler("handler").basePath(process.cwd());
	}

	_createClass(ConanAwsLambdaPlugin, [{
		key: "updateClients",
		value: function updateClients() {
			// TODO: Add coverage for the AWS.Lambda config here.
			// Currently not possible without lots of extra work.
			// See: https://github.com/dwyl/aws-sdk-mock/issues/38
			var awsConfig = { region: this.region(), profile: this.profile() };

			this.lambdaClient(new _awsSdk2.default.Lambda(awsConfig));
			this.iamClient(new _awsSdk2.default.IAM(awsConfig));
		}
	}]);

	return ConanAwsLambdaPlugin;
}();

exports.default = ConanAwsLambdaPlugin;