import validateLambda from "../../../lib/steps/validateLambda.js";

describe(".validateLambda(conan, lambda, stepDone) (When lambda is missing a role)", () => {
	let conan,
			lambda,
			returnedError;

	beforeEach(done => {
		conan = { config: {} };
		lambda = {
			role: () => {},
			packages: () => { return { async: "1.0.0"	}; }
		};
		validateLambda(conan, lambda, error => {
			returnedError = error;
			done();
		});
	});

	it("should return an error", () => {
		returnedError.message.should.be.eql(".role() is a required parameter for a lambda.");
	});
});
