import ConanAwsLambda from "../../../lib/components/conanAwsLambda.js";
import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";
import Conan from "conan";

describe("conanAwsLambda.packagesDirectory([newPackagesDirectory])", () => {
	let lambda,
			conan;

	beforeEach(() => {
		conan = new Conan().use(ConanAwsLambdaPlugin);
		lambda = new ConanAwsLambda(conan);
	});

	it("should be null by default", () => {
		(lambda.packagesDirectory() === null).should.be.true;
	});

	it("should be a getter and a setter", () => {
		const packagesDirectory = "/some/path/to/packages";
		lambda.packagesDirectory(packagesDirectory);
		lambda.packagesDirectory().should.eql(packagesDirectory);
	});
});
