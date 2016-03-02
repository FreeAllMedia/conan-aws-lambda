"use strict";

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

var _glob = require("glob");

var _glob2 = _interopRequireDefault(_glob);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

_temp2.default.track();

xdescribe(".buildPackageStep(conan, context, stepDone)", function () {
	var mockConan = undefined,
	    context = undefined,
	    mockLambda = undefined,
	    akiroConstructorSpy = undefined,
	    mockAkiro = undefined;

	var MockAkiro = function MockAkiro() {
		_classCallCheck(this, MockAkiro);

		akiroConstructorSpy.apply(undefined, arguments);
		return mockAkiro;
	};

	beforeEach(function () {
		mockConan = {
			config: {
				region: "us-east-1",
				bucket: "my-bucket"
			}
		};

		mockLambda = {
			name: function name() {
				return "MyLambda";
			}
		};

		mockAkiro = {
			package: _sinon2.default.spy(function (packages, outputDirectory, packageCallback) {
				_fs2.default.mkdirSync(outputDirectory);
				packageCallback();
			})
		};

		akiroConstructorSpy = _sinon2.default.spy();

		context = {
			temporaryDirectoryPath: _temp2.default.mkdirSync("buildPackageStep"),
			libraries: {
				Akiro: MockAkiro
			},
			parameters: mockLambda
		};
	});

	describe("(when .packages() are set)", function () {
		beforeEach(function (done) {
			mockLambda.packages = function () {
				return {
					flowsync: "0.1.12",
					incognito: "0.1.4"
				};
			};
			(0, _buildPackageStep2.default)(mockConan, context, stepDone(done));
		});

		it("should configure akiro with the designated options", function () {
			akiroConstructorSpy.calledWith({
				region: mockConan.config.region,
				bucket: mockConan.config.bucket
			}).should.be.true;
		});

		it("should call akiro.package with the specified packages", function () {
			mockAkiro.package.calledWith(mockLambda.packages()).should.be.true;
		});

		it("should return the package zip file path", function () {
			var expectedPackageZipFilePath = context.temporaryDirectoryPath + "/zip/" + (0, _jargon2.default)(mockLambda.name()).camel.toString() + ".packages.zip";
			stepReturnData.should.eql({
				packageZipFilePath: expectedPackageZipFilePath
			});
		});

		it("should generate a zip file containing all of the built packages at the package zip file path", function (done) {
			var expectedPackageZipFilePath = context.temporaryDirectoryPath + "/zip/" + (0, _jargon2.default)(mockLambda.name()).camel.toString() + ".packages.zip";
			var expectedFilePaths = _glob2.default.sync(context.temporaryDirectoryPath + "/zip/");

			var zipFilePaths = [];

			_fs2.default.createReadStream(expectedPackageZipFilePath).pipe(_unzip2.default.Parse()).on("entry", function (entry) {
				zipFilePaths.push(entry.path);
			}).on("close", function () {
				zipFilePaths.should.have.members(expectedFilePaths);
				done();
			});
		});
	});

	describe("(when .packages() are NOT set)", function () {
		beforeEach(function (done) {
			mockLambda.packages = function () {};
			(0, _buildPackageStep2.default)(mockConan, context, stepDone(done));
		});

		it("should return with the package zip file path set to null", function () {
			stepReturnData.should.eql({
				packageZipFilePath: null
			});
		});
	});
});

/* SPEC UTILITIES BELOW HERE */

var stepReturnError = undefined;
var stepReturnData = undefined;

function stepDone(done) {
	return function (error, data) {
		stepReturnError = error;
		stepReturnData = data;
		done();
	};
}