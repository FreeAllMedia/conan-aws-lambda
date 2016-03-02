"use strict";

var _gulp = require("gulp");

var _gulp2 = _interopRequireDefault(_gulp);

var _gulpBabel = require("gulp-babel");

var _gulpBabel2 = _interopRequireDefault(_gulpBabel);

var _paths = require("../paths.json");

var _paths2 = _interopRequireDefault(_paths);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_gulp2.default.task("build-spec", function () {
	return _gulp2.default.src(_paths2.default.source.spec).pipe((0, _gulpBabel2.default)()).pipe(_gulp2.default.dest(_paths2.default.build.directories.spec));
});