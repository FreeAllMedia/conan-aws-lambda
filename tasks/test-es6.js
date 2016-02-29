import gulp from "gulp";
import mocha from "gulp-mocha";
import istanbul from "gulp-babel-istanbul";
import paths from "../paths.json";
import gulpFilter from "gulp-filter";

import chai from "chai";
chai.should(); // This enables should-style syntax

gulp.task("test-es6", (cb) => {
	//const filter = gulpFilter(["**/*", "!es6/spec/fixtures/**/*.spec.js"]);

	gulp.src(paths.source.lib)
		//.pipe(filter)
		.pipe(istanbul()) // Covering files
		.pipe(istanbul.hookRequire()) // Force `require` to return covered files
		.on("finish", () => {
			gulp.src(paths.build.sourceSpec)
				//.pipe(filter)
				.pipe(mocha())
				.pipe(istanbul.writeReports({dir: `${__dirname}/../`, reporters: ["text-summary", "lcovonly"]})) // Creating the reports after tests ran
				// .pipe(istanbul.enforceThresholds({ thresholds: { global: 100 } })) // Enforce a coverage of 100%
				.on("end", cb);
		});
});
