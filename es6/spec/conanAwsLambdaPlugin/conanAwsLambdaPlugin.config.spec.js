import Conan from "conan";
import ConanAwsLambdaPlugin from "../../lib/conanAwsLambdaPlugin.js";

describe("ConanAwsLambdaPlugin(conan)", () => {
	let conan;

	beforeEach(() => {
		conan = new Conan();
		conan.use(ConanAwsLambdaPlugin);
	});

	it("should set conan.config.region to 'us-east-1' by default", () => {
		conan.config.region.should.eql("us-east-1");
	});

	it("should NOT set conan.config.region to 'us-east-1' if already set", () => {
		conan = new Conan({
			region: "us-west-2"
		});
		conan.use(ConanAwsLambdaPlugin);
		conan.config.region.should.eql("us-west-2");
	});

	it("should set conan.config.basePath to process.cwd by default", () => {
		conan.config.basePath.should.eql(process.cwd());
	});

	it("should NOT set conan.config.basePath to process.cwd if already set", () => {
		conan = new Conan({
			basePath: "myCustomPath"
		});
		conan.use(ConanAwsLambdaPlugin);
		conan.config.basePath.should.eql("myCustomPath");
	});
});
