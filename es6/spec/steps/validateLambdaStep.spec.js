import validateLambdaStep from "../../lib/steps/validateLambdaStep.js";

describe(".validateLambdaStep(conan, context, stepDone)", () => {
	let conan,
			context;

	beforeEach(() => {
		conan = { config: {} };
		context = { parameters: {} };
	});

	describe("(When lambda is valid)", () => {
		beforeEach(done => {
			conan.config.bucket = "our-bucket";

			context.parameters = {
				role: () => { return "MyIamRoleName"; },
				packages: () => { return { async: "1.0.0"	}; }
			};
			validateLambdaStep(conan, context, stepDone(done));
		});

		it("should return nothing", () => {
			(stepReturnData === undefined).should.be.true;
		});
	});

	describe("(When lambda is missing a role)", () => {
		beforeEach(done => {
			context.parameters = {
				role: () => {}
			};
			validateLambdaStep(conan, context, stepDone(done));
		});

		it("should return an error", () => {
			stepReturnError.message.should.be.eql(".role() is a required parameter for a lambda.");
		});
	});

	describe("(When lambda has packages set, but conan missing a bucket)", () => {
		beforeEach(done => {
			context.parameters = {
				role: () => { return "MyIamRoleName"; },
				packages: () => { return { async: "1.0.0"	}; }
			};
			validateLambdaStep(conan, context, stepDone(done));
		});

		it("should return an error", () => {
			stepReturnError.message.should.be.eql("conan.config.bucket is required to use .packages().");
		});
	});

	/* SPEC UTILITIES BELOW HERE */

	let stepReturnError;
	let stepReturnData;

	function stepDone (done) {
		return (error, data) => {
			stepReturnError = error;
			stepReturnData = data;
			done();
		};
	}
});
