import save from "./save.js";

/* istanbul ignore next */
export function handler(event, context, callback) {
	save(event, () => {
		callback(null, "Saved!");
	});
}
