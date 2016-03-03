import buildPackageStep from "../../lib/steps/buildPackageStep.js";
import sinon from "sinon";
import fileSystem from "fs-extra";
import path from "path";
import temp from "temp";
import glob from "glob";

temp.track();

describe(".buildPackageStep(conan, context, stepDone)", () => {
	let mockConan,
			context,

			mockLambda,

			akiroConstructorSpy,
			mockAkiro,

			mockPackagesDirectoryPath,
			temporaryDirectoryPath;


	class MockAkiro {
		constructor(...options) {
			akiroConstructorSpy(...options);
			return mockAkiro;
		}
	}

	beforeEach(() => {
		mockConan = {
			config: {
				region: "us-east-1",
				bucket: "my-bucket"
			}
		};

		mockLambda = {
			name: () => { return "MyLambda"; }
		};

		temporaryDirectoryPath = temp.mkdirSync("buildPackageStep");

		mockPackagesDirectoryPath = path.normalize(`${__dirname}/../fixtures/packages/unzipped`);

		mockAkiro = {
			package: sinon.spy((packages, outputDirectory, packageCallback) => {
				fileSystem.mkdirSync(outputDirectory);
				fileSystem.copySync(mockPackagesDirectoryPath, `${temporaryDirectoryPath}/zip`);
				packageCallback();
			})
		};

		akiroConstructorSpy = sinon.spy();

		context = {
			temporaryDirectoryPath: temporaryDirectoryPath,
			libraries: {
				Akiro: MockAkiro
			},
			parameters: mockLambda
		};
	});

	describe("(when .packages() are set)", () => {
		beforeEach(done => {
			mockLambda.packages = () => {
				return {
					flowsync: "0.1.12",
					incognito: "0.1.4"
				};
			};
			buildPackageStep(mockConan, context, stepDone(done));
		});

		describe("(when successful)", () => {
			it("should configure akiro with the designated options", () => {
				akiroConstructorSpy.calledWith({
					region: mockConan.config.region,
					bucket: mockConan.config.bucket
				}).should.be.true;
			});

			it("should call akiro.package with the specified packages", () => {
				mockAkiro.package.calledWith(mockLambda.packages()).should.be.true;
			});

			it("should return the built packages temporary directory path", () => {
				const expectedPackagesDirectoryPath = `${context.temporaryDirectoryPath}/zip`;
				stepReturnData.should.eql({
					packagesDirectoryPath: expectedPackagesDirectoryPath
				});
			});

			it("should put all of the built files into the temporary directory path", () => {
				let expectedFilePaths = glob.sync(`${mockPackagesDirectoryPath}/**/*`, { dot: true });

				expectedFilePaths = expectedFilePaths.map(filePath => {
					return filePath.replace(mockPackagesDirectoryPath, stepReturnData.packagesDirectoryPath);
				});
				const actualFilePaths = glob.sync(`${stepReturnData.packagesDirectoryPath}/**/*`, { dot: true });
				actualFilePaths.should.eql(expectedFilePaths);
			});
		});

		describe("(when akiro errors)", () => {
			let error;

			beforeEach(done => {
				mockAkiro.package = sinon.spy((packages, outputDirectory, packageCallback) => {
					error = new Error();
					packageCallback(error);
				});

				buildPackageStep(mockConan, context, stepDone(done));
			});

			it("should return the akiro error in the callback", () => {
				stepReturnError.should.eql(error);
			});
		});
	});

	describe("(when .packages() are NOT set)", () => {
		beforeEach(done => {
			mockLambda.packages = () => {};
			buildPackageStep(mockConan, context, stepDone(done));
		});

		it("should return with the package zip file path set to null", () => {
			stepReturnData.should.eql({
				packageZipFilePath: null
			});
		});
	});
});

/* SPEC UTILITIES BELOW HERE */

let stepReturnError;
let stepReturnData;

function stepDone (done) {
	return (error, data) => {
		stepReturnError = error;
		stepReturnData = data;
		done();
	};
}
