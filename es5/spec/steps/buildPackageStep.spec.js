"use strict";

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _conan = require("conan");

var _conan2 = _interopRequireDefault(_conan);

var _buildPackageStep = require("../../lib/steps/buildPackageStep.js");

var _buildPackageStep2 = _interopRequireDefault(_buildPackageStep);

var _sinon = require("sinon");

var _sinon2 = _interopRequireDefault(_sinon);

var _fs = require("fs");

var _fs2 = _interopRequireDefault(_fs);

var _path = require("path");

var _path2 = _interopRequireDefault(_path);

var _temp = require("temp");

var _temp2 = _interopRequireDefault(_temp);

var _unzip = require("unzip2");

var _unzip2 = _interopRequireDefault(_unzip);

var _jargon = require("jargon");

var _jargon2 = _interopRequireDefault(_jargon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_temp2.default.track();

xdescribe(".buildPackageStep(conan, context, stepDone)", function () {
	var conan = undefined,
	    conanAwsLambda = undefined,
	    context = undefined,
	    stepDone = undefined,
	    stepReturnError = undefined,
	    stepReturnData = undefined,
	    mockAkiroConstructorSpy = undefined,
	    _packages = undefined,
	    packageZipFileName = undefined;

	beforeEach(function (done) {
		conan = new _conan2.default({
			region: "us-east-1",
			bucket: "some-bucket-here"
		});

		_packages = {
			"async": "1.0.0",
			"temp": "0.8.3"
		};

		conanAwsLambda = {
			name: function name() {
				return "MyLambda";
			},
			packages: function packages() {
				return _packages;
			}
		};

		var lambdaName = conanAwsLambda.name();

		packageZipFileName = (0, _jargon2.default)(lambdaName).camel.toString() + ".packages.zip";

		mockAkiroConstructorSpy = _sinon2.default.spy();

		var MockAkiro = function MockAkiro() {
			_classCallCheck(this, MockAkiro);

			for (var _len = arguments.length, options = Array(_len), _key = 0; _key < _len; _key++) {
				options[_key] = arguments[_key];
			}

			mockAkiroConstructorSpy(options);
		};

		MockAkiro.prototype.package = _sinon2.default.spy(function (packagesAndVersions, outputDirectory, callback) {
			//fileSystem.copySync("../fixtures/")
			callback(null);
		});

		_temp2.default.mkdir("compilePackages", function (error, temporaryDirectoryPath) {
			context = {
				temporaryDirectoryPath: temporaryDirectoryPath,
				parameters: conanAwsLambda,
				libraries: { Akiro: MockAkiro },
				results: {}
			};

			stepDone = function stepDone(afterStepCallback) {
				return function (callbackError, data) {
					stepReturnError = callbackError;
					stepReturnData = data;
					afterStepCallback();
				};
			};

			(0, _buildPackageStep2.default)(conan, context, stepDone(done));
		});
	});

	afterEach(function (done) {
		_temp2.default.cleanup(done);
	});

	it("should be a function", function () {
		(typeof _buildPackageStep2.default === "undefined" ? "undefined" : _typeof(_buildPackageStep2.default)).should.equal("function");
	});

	it("should configure akiro with the designated parameters", function () {
		mockAkiroConstructorSpy.firstCall.args.should.eql({
			region: conan.config.region,
			bucket: conan.config.bucket
		});
	});

	describe("(When packages are set to be compiled)", function () {
		it("should have all package files within the package zip", function (done) {
			/* eslint-disable new-cap */
			var zipFilePaths = [];

			_fs2.default.createReadStream(stepReturnData.packageZipFilePath).pipe(_unzip2.default.Parse()).on("entry", function (entry) {
				zipFilePaths.push(entry.path);
			}).on("close", function () {
				var asyncFilePaths = ["async/.jshintrc", "async/.travis.yml", "async/CHANGELOG.md", "async/LICENSE", "async/README.md", "async/bower.json", "async/component.json", "async/lib/", "async/lib/async.js", "async/package.json", "async/support/", "async/support/sync-package-managers.js"];

				zipFilePaths.should.have.members(asyncFilePaths);

				done();
			});
		});

		it("should return the package zip file's file path", function () {
			_fs2.default.existsSync(stepReturnData.packageZipFilePath).should.be.true;
		});

		it("should name the package zip file according to the lambda name", function () {
			var returnedPackageZipFileName = _path2.default.basename(stepReturnData.packageZipFilePath);
			returnedPackageZipFileName.should.eql(packageZipFileName);
		});
	});

	describe("(When packages are NOT set to be compiled)", function () {
		it("should return with the package zip file path set to null", function (done) {
			_packages = undefined;
			(0, _buildPackageStep2.default)(conan, context, function (error, results) {
				(results.packageZipFilePath === null).should.be.true;
				done();
			});
		});
	});
});