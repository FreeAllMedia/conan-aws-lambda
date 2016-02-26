import Conan from "conan";
import buildPackageStep from "../../lib/steps/buildPackageStep.js";
import sinon from "sinon";
import fileSystem from "fs";
import path from "path";
import temp from "temp";
import unzip from "unzip2";
import inflect from "jargon";

temp.track();

describe(".buildPackageStep(conan, context, stepDone)", () => {
	let conan,
			conanAwsLambda,

			context,
			stepDone,

			stepReturnError,
			stepReturnData,

			mockAkiroConstructorSpy,

			packages,
			packageZipFileName;

	beforeEach(done => {
		conan = new Conan({
			region: "us-east-1",
			bucket: "some-bucket-here"
		});

		packages = {
			"async": "1.0.0",
			"temp": "0.8.3"
		};

		conanAwsLambda = {
			name: () => { return "MyLambda"; },
			packages: () => { return packages; }
		};

		const lambdaName = conanAwsLambda.name();

		packageZipFileName = `${inflect(lambdaName).camel.toString()}.packages.zip`;

		mockAkiroConstructorSpy = sinon.spy();

		class MockAkiro {
			constructor(...options) {
				mockAkiroConstructorSpy(options);
			}
		}

		MockAkiro.prototype.package = sinon.spy((packagesAndVersions, outputDirectory, callback) => {
			//fileSystem.copySync("../fixtures/")
			callback(null);
		});

		temp.mkdir("compilePackages", (error, temporaryDirectoryPath) => {
			context = {
				temporaryDirectoryPath: temporaryDirectoryPath,
				parameters: conanAwsLambda,
				libraries: { Akiro: MockAkiro },
				results: {}
			};

			stepDone = (afterStepCallback) => {
				return (callbackError, data) => {
					stepReturnError = callbackError;
					stepReturnData = data;
					afterStepCallback();
				};
			};

			buildPackageStep(conan, context, stepDone(done));
		});
	});

	afterEach(done => {
		temp.cleanup(done);
	});

	it("should be a function", () => {
		(typeof buildPackageStep).should.equal("function");
	});

	it("should configure akiro with the designated parameters", () => {
		mockAkiroConstructorSpy.firstCall.args.should.eql({
			region: conan.config.region,
			bucket: conan.config.bucket
		});
	});

	describe("(When packages are set to be compiled)", () => {
		it("should have all package files within the package zip", done => {
			/* eslint-disable new-cap */
			let zipFilePaths = [];

			fileSystem.createReadStream(stepReturnData.packageZipFilePath)
				.pipe(unzip.Parse())
				.on("entry", (entry) => {
					zipFilePaths.push(entry.path);
				})
				.on("close", () => {
					const asyncFilePaths = [
						"async/.jshintrc",
						"async/.travis.yml",
						"async/CHANGELOG.md",
						"async/LICENSE",
						"async/README.md",
						"async/bower.json",
						"async/component.json",
						"async/lib/",
						"async/lib/async.js",
						"async/package.json",
						"async/support/",
						"async/support/sync-package-managers.js"
					];

					zipFilePaths.should.have.members(asyncFilePaths);

					done();
				});
		});

		it("should return the package zip file's file path", () => {
			fileSystem.existsSync(stepReturnData.packageZipFilePath).should.be.true;
		});

		it("should name the package zip file according to the lambda name", () => {
			const returnedPackageZipFileName = path.basename(stepReturnData.packageZipFilePath);
			returnedPackageZipFileName.should.eql(packageZipFileName);
		});
	});

	describe("(When packages are NOT set to be compiled)", () => {
		it("should return with the package zip file path set to null", done => {
			packages = undefined;
			buildPackageStep(conan, context, (error, results) => {
				(results.packageZipFilePath === null).should.be.true;
				done();
			});
		});
	});
});
