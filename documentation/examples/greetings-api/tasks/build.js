import gulp from "gulp";
import babel from "gulp-babel";

gulp.task("build", () => {
	return gulp.src("./es6/**/*")
		.pipe(babel())
		.pipe(gulp.dest("./es5/"));
});
