import Conan from "conan";
import ConanAwsLambdaPlugin from "../../lib/conanAwsLambdaPlugin.js";

describe("conan.handler([newHandler])", () => {
	let conan;

	beforeEach(() => {
		conan = new Conan().use(ConanAwsLambdaPlugin);
	});

  it("should be set to an empty array by default", () => {
		conan.handler().should.eql("handler");
	});

	it("should be a getter and a setter", () => {
		const handler = "invoke";
		conan.handler(handler);
		conan.handler().should.eql(handler);
	});
});
