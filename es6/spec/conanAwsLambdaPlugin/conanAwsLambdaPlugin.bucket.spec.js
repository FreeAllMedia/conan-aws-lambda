import Conan from "conan";
import ConanAwsLambdaPlugin from "../../lib/conanAwsLambdaPlugin.js";

describe("conan.bucket([newLambdaClient])", () => {
	let conan;

	beforeEach(() => {
		conan = new Conan().use(ConanAwsLambdaPlugin);
	});

	it("should be set to null by default", () => {
		(conan.bucket() === null).should.be.true;
	});

	it("should be a getter and a setter", () => {
		const bucket = "some-bucket";
		conan.bucket(bucket);
		conan.bucket().should.eql(bucket);
	});
});
