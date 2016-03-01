export function handler(input, context) {
	let from;

	if(!input.data
		|| !input.data.from) {
		context.done(new Error(`Insufficient parameters receive a proper greeting. Send at least a from field on the request body.`));
	} else {
		from = input.data.from;
		const message = `Thanks ${from}, we received your greeting and we really appreciate it.`;
		context.done(null, { message });
	}
}
