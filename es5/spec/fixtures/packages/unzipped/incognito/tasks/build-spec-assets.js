"use strict";

var _gulp = require("gulp");

var _gulp2 = _interopRequireDefault(_gulp);

var _paths = require("../paths.json");

var _paths2 = _interopRequireDefault(_paths);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_gulp2.default.task("build-spec-assets", function () {
	return _gulp2.default.src(_paths2.default.source.specAssets).pipe(_gulp2.default.dest(_paths2.default.build.directories.spec));
});
//import babel from "gulp-babel";