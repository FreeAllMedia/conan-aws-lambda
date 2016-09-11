import ConanAwsLambdaPlugin from "../../lib/conanAwsLambdaPlugin.js";
import Conan from "conan";

describe("conanAwsLambda.file([newFilePath])", () => {
	let lambda,
			file,
			conan;

	beforeEach(() => {
		conan = new Conan().use(ConanAwsLambdaPlugin);
		file = "path/to/handler.js";

		lambda = conan.lambda("SomeLambda");
	});

	it("should be null by default", () => {
		(lambda.file() === null).should.be.true;
	});

	it("should be a getter and a setter", () => {
		lambda.file(file);
		lambda.file().should.eql(file);
	});
});
