const moment = require("moment");

exports.handler = function handler(event, context) {
	const currentTime = moment().format();

	context.succeed(currentTime);
};
