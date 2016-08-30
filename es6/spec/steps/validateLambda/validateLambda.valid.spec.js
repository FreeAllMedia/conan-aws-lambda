import validateLambda from "../../../lib/steps/validateLambda.js";

describe(".validateLambda(conan, lambda, stepDone) (When lambda is valid)", () => {
	let conan,
			lambda,
			returnedError;

	beforeEach(done => {
		conan = { config: {} };
		lambda = {
			role: () => { return "MyIamRoleName"; },
			packages: () => { return { async: "1.0.0"	}; }
		};
		conan.config.bucket = "our-bucket";
		validateLambda(conan, lambda, error => {
			returnedError = error;
			done();
		});
	});

	it("should not return an error", () => {
		(returnedError === undefined).should.be.true;
	});
});
