import ConanAwsLambdaPlugin from "../../lib/conanAwsLambdaPlugin.js";
import Conan from "conan";

describe("conanAwsLambda.zipPath([newZipPath])", () => {
	let lambda,
			conan;

	beforeEach(() => {
		conan = new Conan().use(ConanAwsLambdaPlugin);
		lambda = conan.lambda("SomeLambda");
	});

	it("should be null by default", () => {
		(lambda.zipPath() === null).should.be.true;
	});

	it("should be a getter and a setter", () => {
		const zipPath = "/some/path/to/packages";
		lambda.zipPath(zipPath);
		lambda.zipPath().should.eql(zipPath);
	});
});
