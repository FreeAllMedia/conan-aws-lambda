import { ConanComponent } from "conan";

export default class Alias extends ConanComponent {
	initialize(lambda, name) {
		this.properties(
			"name",
			"arn",
			"description"
		);

		this.name(name);
	}
}
