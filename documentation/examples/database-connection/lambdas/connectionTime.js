/* eslint-disable no-console */

var mysql = require("mysql");
var credentials = require("../mcsmike.mysql.json");

exports.handler = function connectionTime(event, context) {
	var connection = mysql.createConnection({
		host: credentials.host,
		user: credentials.user,
		password: credentials.password
	});

	var startTime = new Date();

	connection.connect(function(err) {
		var endTime = new Date();
		if (err) {
			context.fail("error connecting: " + err.stack);
			return;
		}
		var timeElapsed = endTime - startTime;
		var message = "connection time elapsed: " + timeElapsed;
		console.log(message);
		context.succeed(message);
	});
};
