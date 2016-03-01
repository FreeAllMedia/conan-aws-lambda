"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.handler = handler;

var _acceptLanguage = require("accept-language");

var _acceptLanguage2 = _interopRequireDefault(_acceptLanguage);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_acceptLanguage2.default.languages(["en-US", "es-AR", "zh-CN", "hi-IN", "it-IT", "fr-fr", "pt-BR"]);

function handler(input, context) {
	var name = undefined;
	var language = undefined;
	var age = undefined;

	if (!input.params.queryString.name || !input.params.header.acceptLanguage || !input.params.path.age) {
		context.done(new Error("Insufficient parameters to gave a proper greeting. Send at least an age on the path, a name on the query string and the accept-language header on the request."));
	} else {
		name = input.params.queryString.name;
		language = _acceptLanguage2.default.get(input.params.header.acceptLanguage);
		age = input.params.path.age;

		var hello = "Hello";

		if (language.indexOf("es") === 0) {
			hello = "Hola";
		} else if (language.indexOf("pt") === 0) {
			hello = "Olá";
		} else if (language.indexOf("it") === 0) {
			hello = "Ciao";
		} else if (language.indexOf("hi") === 0) {
			hello = "नमस्ते";
		} else if (language.indexOf("zh") === 0) {
			hello = "你好";
		} else if (language.indexOf("fr") === 0) {
			hello = "Bonjour";
		}

		var greetingString = hello + " " + name + " (" + age + ")";
		context.done(null, { greetingString: greetingString });
	}
}