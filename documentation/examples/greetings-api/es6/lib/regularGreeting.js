import acceptLanguage from "accept-language";

acceptLanguage.languages(["en-US", "es-AR", "zh-CN", "hi-IN", "it-IT", "fr-fr", "pt-BR"]);

export function handler(input, context) {
	let name;
	let language;
	let age;

	if(!input.params.queryString.name
		|| !input.params.header.acceptLanguage
		|| !input.params.path.age) {
		context.done(new Error(`Insufficient parameters to gave a proper greeting. (age=${input.params.path.age},name=${input.params.queryString.name},language=${input.params.header.acceptLanguage})`));
	} else {
		name = input.params.queryString.name;
		language = acceptLanguage.get(input.params.header.acceptLanguage);
		age = input.params.path.age;

		let hello = "Hello";

		if(language.indexOf("es") === 0) {
			hello = "Hola";
		} else if(language.indexOf("pt") === 0) {
			hello = "Olá";
		} else if(language.indexOf("it") === 0) {
			hello = "Ciao";
		} else if(language.indexOf("hi") === 0) {
			hello = "नमस्ते";
		} else if(language.indexOf("zh") === 0) {
			hello = "你好";
		} else if(language.indexOf("fr") === 0) {
			hello = "Bonjour";
		}

		const greetingString = `${hello} ${name} (${age})`;
		context.done(null, { greetingString });
	}
}
