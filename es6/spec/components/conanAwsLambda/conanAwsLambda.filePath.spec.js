import ConanAwsLambda from "../../../lib/components/conanAwsLambda.js";
import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";
import Conan from "conan";

describe("conanAwsLambda.filePath([newFilePath])", () => {
	let lambda,
			filePath,
			conan;

	beforeEach(() => {
		conan = new Conan().use(ConanAwsLambdaPlugin);
		filePath = "path/to/handler.js";

		lambda = new ConanAwsLambda(conan);
	});

	it("should be null by default", () => {
		(lambda.filePath() === null).should.be.true;
	});

	it("should be a getter and a setter", () => {
		lambda.filePath(filePath);
		lambda.filePath().should.eql(filePath);
	});
});
