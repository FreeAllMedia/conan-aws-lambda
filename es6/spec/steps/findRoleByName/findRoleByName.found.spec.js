import Conan from "conan";
import findRoleByName from "../../lib/steps/findRoleByName.js";
import sinon from "sinon";

xdescribe(".findRoleByName(conan, context, stepDone) (Found)", () => {
	let conan,
			context,
			stepDone,

			awsResponseError,
			awsResponseData,

			stepReturnError,
			stepReturnData,

			parameters;

	const mockIam = {
		getRole: sinon.spy((params, callback) => {
			callback(awsResponseError, awsResponseData);
		})
	};

	const MockAWS = {
		IAM: sinon.spy(() => {
			return mockIam;
		})
	};

	beforeEach(done => {
		conan = new Conan({
			region: "us-east-1"
		});

		parameters = new class MockConanAwsLambda {
			role() { return "TestFunction"; }
		}();

		context = {
			parameters: parameters,
			libraries: { AWS: MockAWS },
			results: {}
		};

		// "Role Found" response by default
		awsResponseData = {
			Role: {
				Arn: "arn:aws:lambda:us-east-1:123895237541:role:SomeRole"
			}
		};
		awsResponseError = null;

		stepDone = (afterCallback) => {
			return (error, data) => {
				stepReturnError = error;
				stepReturnData = data;
				afterCallback();
			};
		};

		findRoleByName(conan, context, stepDone(done));
	});

	it("should be a function", () => {
		(typeof findRoleByName).should.equal("function");
	});

	it("should set the designated region on the lambda client", () => {
		MockAWS.IAM.calledWith({
			region: conan.config.region
		}).should.be.true;
	});

	it("should call AWS with the designated role name parameter", () => {
		mockIam.getRole.calledWith({
			RoleName: context.parameters.role()
		}).should.be.true;
	});

	describe("(Role is Found)", () => {
		it("should return the found role id", () => {
			stepReturnData.should.eql({
				roleArn: awsResponseData.Role.Arn
			});
		});
	});
});
