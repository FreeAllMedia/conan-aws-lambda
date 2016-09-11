import ConanAwsLambdaPlugin from "../../lib/conanAwsLambdaPlugin.js";
import Conan from "conan";

describe("conanAwsLambda.bucket([newArn])", () => {
	let lambda,
			conan;

	beforeEach(() => {
		conan = new Conan().use(ConanAwsLambdaPlugin);
		conan.use(ConanAwsLambdaPlugin);
		conan.bucket("our-bucket");
		lambda = conan.lambda("SomeLambda");
	});

	it("should copy conan's .bucket()", () => {
		lambda.bucket().should.eql(conan.bucket());
	});

	it("should be settable", () => {
		const bucket = "some-bucket";
		lambda.bucket(bucket);
		lambda.bucket().should.eql(bucket);
	});
});
