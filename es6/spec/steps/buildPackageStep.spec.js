import buildPackageStep from "../../lib/steps/buildPackageStep.js";
import sinon from "sinon";
import fileSystem from "fs";
import path from "path";
import temp from "temp";
import unzip from "unzip2";
import inflect from "jargon";
import glob from "glob";

temp.track();

describe(".buildPackageStep(conan, context, stepDone)", () => {
	let mockConan,
			context,

			mockLambda,

			akiroConstructorSpy,
			mockAkiro;


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

		mockAkiro = {
			package: sinon.spy((packages, outputDirectory, packageCallback) => {
				fileSystem.mkdirSync(outputDirectory);
				packageCallback();
			})
		};

		akiroConstructorSpy = sinon.spy();

		context = {
			temporaryDirectoryPath: temp.mkdirSync("buildPackageStep"),
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

		it("should configure akiro with the designated options", () => {
			akiroConstructorSpy.calledWith({
				region: mockConan.config.region,
				bucket: mockConan.config.bucket
			}).should.be.true;
		});

		it("should call akiro.package with the specified packages", () => {
			mockAkiro.package.calledWith(mockLambda.packages()).should.be.true;
		});

		it("should return the package zip file path", () => {
			const expectedPackageZipFilePath = `${context.temporaryDirectoryPath}/zip/${inflect(mockLambda.name()).camel.toString()}.packages.zip`;
			stepReturnData.should.eql({
				packageZipFilePath: expectedPackageZipFilePath
			});
		});

		it("should generate a zip file containing all of the built packages at the package zip file path", done => {
			const expectedPackageZipFilePath = `${context.temporaryDirectoryPath}/zip/${inflect(mockLambda.name()).camel.toString()}.packages.zip`;
			const expectedFilePaths = glob.sync(`${context.temporaryDirectoryPath}/zip/`);

			let zipFilePaths = [];

			fileSystem.createReadStream(expectedPackageZipFilePath)
				.pipe(unzip.Parse())
				.on("entry", entry => {
					zipFilePaths.push(entry.path);
				})
				.on("close", () => {
					zipFilePaths.should.have.members(expectedFilePaths);
					done();
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
