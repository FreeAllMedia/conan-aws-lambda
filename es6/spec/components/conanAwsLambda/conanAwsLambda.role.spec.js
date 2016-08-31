import ConanAwsLambda from "../../../lib/components/conanAwsLambda.js";
import ConanAwsLambdaPlugin from "../../../lib/conanAwsLambdaPlugin.js";
import Conan from "conan";

describe("conanAwsLambda.role([newRoleName])", () => {
	let lambda,
			role,
			conan;

	beforeEach(() => {
		conan = new Conan().use(ConanAwsLambdaPlugin);
		role = "Admin";

		lambda = new ConanAwsLambda(conan);
	});

	it("should be null by default", () => {
		(lambda.role() === null).should.be.true;
	});

	it("should be a getter and a setter", () => {
		lambda.role(role);
		lambda.role().should.eql(role);
	});
});
