const mockLambda = {
	getFunction: sinon.spy((params, callback) => {
		callback(awsResponseError, awsResponseData);
	})
};

class MockLambda {
	constructor(config) {
		mockLambdaSpy(config);
		return mockLambda;
	}
}

const MockAWS = {
	Lambda: MockLambda
};

export default MockAWS;
