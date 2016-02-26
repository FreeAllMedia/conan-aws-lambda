import Conan from "conan";
import ConanAwsLambda from "../lib/components/conanAwsLambda.js";
import ConanAwsLambdaPlugin from "../lib/conanAwsLambdaPlugin.js";
import sinon from "sinon";
import AWS from "aws-sdk";
import Akiro from "akiro";

describe("ConanAwsLambdaPlugin(conan)", () => {
	let conan;

	beforeEach(() => {
		conan = new Conan();
		conan.use(ConanAwsLambdaPlugin);
	});

	it("should set conan.config.region to 'us-east-1' if not already set", () => {
		conan.config.region.should.eql("us-east-1");
	});

	it("should NOT set conan.config.region to 'us-east-1' if already set", () => {
		conan = new Conan({
			region: "us-west-2"
		});
		conan.use(ConanAwsLambdaPlugin);
		conan.config.region.should.eql("us-west-2");
	});

	it("should set conan.config.basePath to process.cwd if not already set", () => {
		conan.config.basePath.should.eql(process.cwd());
	});

	it("should NOT set conan.config.basePath to process.cwd if already set", () => {
		conan = new Conan({
			basePath: "myCustomPath"
		});
		conan.use(ConanAwsLambdaPlugin);
		conan.config.basePath.should.eql("myCustomPath");
	});

  it("should setup conan.lambda()", () => {
		(typeof conan.lambda).should.eql("function");
	});

	it("should setup an empty object to hold lambdas at conan.lambdas", () => {
		conan.lambdas.should.eql({});
	});

	describe("(Libraries)", () => {
		before(() => {
			conan = new Conan();
			conan.steps.constructor.prototype.library = sinon.spy(conan.steps.constructor.prototype.library);
			conan.use(ConanAwsLambdaPlugin);
		});

		it("should add the Akiro library", () => {
			conan.steps.library.calledWith("Akiro", Akiro).should.be.true;
		});

		it("should add the AWS library", () => {
			conan.steps.library.calledWith("AWS", AWS).should.be.true;
		});
	});

	describe("conan.lambda(name, handlerPath)", () => {
		let lambda;
		let name;

		beforeEach(() => {
			name = "AccountCreate";

			lambda = conan.lambda(name);
		});

		it("should return an instance of ConanAwsLambda", () => {
			lambda.should.be.instanceOf(ConanAwsLambda);
		});

		it("should pass conan to the ConanAwsLambda constructor", () => {
			lambda.conan.should.eql(conan);
		});

		it("should pass the lambda name to the ConanAwsLambda constructor", () => {
			lambda.name().should.eql(name);
		});
	});
});
