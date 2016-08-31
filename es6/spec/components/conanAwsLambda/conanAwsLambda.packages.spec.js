import ConanAwsLambda from "../../../lib/components/conanAwsLambda.js";
import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";
import Conan from "conan";

describe("conanAwsLambda.packages([newPackages])", () => {
	let lambda,
			conan;

	beforeEach(() => {
		conan = new Conan().use(ConanAwsLambdaPlugin);
		lambda = new ConanAwsLambda(conan);
	});

	it("should be null by default", () => {
		(lambda.packages() === null).should.be.true;
	});

	it("should be a getter and a setter", () => {
		const packages = { async: "^1.0.0" };
		lambda.packages(packages);
		lambda.packages().should.eql(packages);
	});
});
