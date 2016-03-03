import Conan from "conan";
import compileLambdaZipStep from "../../lib/steps/compileLambdaZipStep.js";
import fileSystem from "fs";
import unzip from "unzip2";
import temp from "temp";
import sinon from "sinon";
import path from "path";
import glob from "glob";

describe(".compileLambdaZipStep(conan, context, stepDone)", () => {
	let conan,
			context,
			stepDone,

			lambdaFilePath,
			dependencyFilePaths,
			packagesDirectoryPath,

			dependenciesSpy,

			stepReturnData,

			conanAwsLambda;

	beforeEach(done => {
		conan = new Conan({
			basePath: `${__dirname}/../../`,
			region: "us-east-1"
		});

		dependenciesSpy = sinon.spy();

		dependencyFilePaths = [];
		packagesDirectoryPath = undefined;

		lambdaFilePath = __dirname + "/../fixtures/lambda.js";

		conanAwsLambda = new class MockConanAwsLambda {
			filePath() 			{	return lambdaFilePath; }
			name() 		 			{	return "TestFunction"; }
			dependencies(value) 	{
				if (value) {
					dependenciesSpy(value);
				}
				return dependencyFilePaths;
			}
			handler() 			{ return ["handler"]; }
		}();

		temp.mkdir("compileLambdaZip", (error, temporaryDirectoryPath) => {
			context = {
				temporaryDirectoryPath: temporaryDirectoryPath,
				parameters: conanAwsLambda,
				libraries: {},
				results: {
					packagesDirectoryPath: packagesDirectoryPath
				}
			};

			stepDone = (callback) => {
				return (callbackError, data) => {
					stepReturnData = data;
					callback();
				};
			};

			compileLambdaZipStep(conan, context, stepDone(done));
		});
	});

	it("should be a function", () => {
		(typeof compileLambdaZipStep).should.equal("function");
	});

	it("should return the lambda zip file path", () => {
		fileSystem.existsSync(stepReturnData.lambdaZipFilePath).should.be.true;
	});

	describe("(With Dependencies)", () => {
		beforeEach(done => {
			// Testing that glob matching works.
			// If glob matching works normal paths will, too.

			const fixturesDirectoryPath = path.normalize(`${__dirname}/../fixtures`);

			dependencyFilePaths = [
				[
					`${fixturesDirectoryPath}/s*e.js`
				],
				[
					`${fixturesDirectoryPath}/d*y.js`,	{
						zipPath: "lib"
					}
				],
				[
					`${fixturesDirectoryPath}/emptyDirectory`
				],
				[
					`${fixturesDirectoryPath}/directory/file.js`
				],
				[
					`${__dirname}/../../lib/conanAwsLambdaPlugin.js`, {
						basePath: `${__dirname}/../..`
					}
				],
				[
					`${__dirname}/../../lib/conanAwsLambdaPlugin.js`, {
						basePath: `${__dirname}/../../`,
						zipPath: "dist"
					}
				]
			];

			compileLambdaZipStep(conan, context, stepDone(done));
		});

		it("should generate the conan handler on the root of the zipFile", done => {
			/* eslint-disable new-cap */
			let zipFilePaths = [];

			fileSystem.createReadStream(stepReturnData.lambdaZipFilePath)
				.pipe(unzip.Parse())
				.on("entry", (entry) => {
					if (entry.path.match(/conanHandler\-[a-zA-Z0-9.]*/)) {
						zipFilePaths.push(entry.path);
					}
				})
				.on("close", () => {
					zipFilePaths.length.should.equal(1);
					done();
				});
		});

		it("should add the lambda file as a dependency", () => {
			dependenciesSpy.calledWith(lambdaFilePath).should.be.true;
		});

		it("should insert the lambda file, the dependencies, and its packages into the zip file", done => {
			/* eslint-disable new-cap */
			let zipFilePaths = [];

			fileSystem.createReadStream(stepReturnData.lambdaZipFilePath)
				.pipe(unzip.Parse())
				.on("entry", (entry) => {
					if (!entry.path.match(/conanHandler\-[a-zA-Z0-9.]*/)) {
						zipFilePaths.push(entry.path);
					}
				})
				.on("close", () => {
					const expectedFilePaths = [
						"spec/fixtures/save.js",
						"lib/spec/fixtures/destroy.js",
						"spec/fixtures/emptyDirectory/",
						"spec/fixtures/directory/file.js",
						"lib/conanAwsLambdaPlugin.js",
						"dist/lib/conanAwsLambdaPlugin.js"
					];

					zipFilePaths.should.eql(expectedFilePaths);

					done();
				});
		});
	});

	describe("(With packages directory path)", () => {
		beforeEach(done => {
			context.results.packagesDirectoryPath = path.normalize(__dirname + "/../fixtures/packages/unzipped/");
			compileLambdaZipStep(conan, context, stepDone(done));
		});

		it("should insert the lambda file, the dependency, and its packages into the zip file", done => {
			let zipFilePaths = [];

			let expectedFilePaths = glob.sync(`${context.results.packagesDirectoryPath}/**/*`, { dot: true });

			fileSystem.createReadStream(stepReturnData.lambdaZipFilePath)
				.pipe(unzip.Parse())
				.on("entry", (entry) => {
					if (!entry.path.match(/conanHandler\-[a-zA-Z0-9.]*/)) {
						zipFilePaths.push(entry.path);
					}
				})
				.on("close", () => {
					expectedFilePaths = expectedFilePaths.map(filePath => {
						return filePath.replace(path.normalize(context.results.packagesDirectoryPath), "node_modules/");
					});

					zipFilePaths = zipFilePaths.map(filePath => {
						if (filePath.substr(-1) === "/") {
							return filePath.substr(0, filePath.length - 1);
						} else {
							return filePath;
						}
					});

					zipFilePaths.should.have.members(expectedFilePaths);
					done();
				});
		});
	});
});
