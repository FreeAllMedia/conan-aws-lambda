import { ConanComponent } from "conan";

export default class Dependency extends ConanComponent {
	initialize(lambda, path) {
		this.properties(
			"path",
			"zipBase",
			"basePath"
		);

		this.path(path);
		this.basePath(lambda.basePath());
	}
}
