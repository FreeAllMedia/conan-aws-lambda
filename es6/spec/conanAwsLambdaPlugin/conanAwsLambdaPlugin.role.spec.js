import Conan from "conan";
import ConanAwsLambdaPlugin from "../../lib/conanAwsLambdaPlugin.js";

describe("conan.role([newRole])", () => {
	let conan;

	beforeEach(() => {
		conan = new Conan();
		conan.use(ConanAwsLambdaPlugin);
	});

  it("should be set to null by default", () => {
		(conan.role() === null).should.be.true;
	});

	it("should be a getter and a setter", () => {
		const role = "SomeRole";
		conan.role(role);
		conan.role().should.eql(role);
	});
});
