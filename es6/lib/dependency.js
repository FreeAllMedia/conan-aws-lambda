import { ConanComponent } from "conan";

export default class Dependency extends ConanComponent {
	initialize(lambda, path) {
		this.properties(
			"path",
			"zipPath",
			"basePath"
		);

		this.path(path);
		this.basePath(lambda.basePath());
	}
}
