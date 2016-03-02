"use strict";

var _gulp = require("gulp");

var _gulp2 = _interopRequireDefault(_gulp);

var _gulpMocha = require("gulp-mocha");

var _gulpMocha2 = _interopRequireDefault(_gulpMocha);

var _gulpIstanbul = require("gulp-istanbul");

var _gulpIstanbul2 = _interopRequireDefault(_gulpIstanbul);

var _paths = require("../paths.json");

var _paths2 = _interopRequireDefault(_paths);

var _chai = require("chai");

var _chai2 = _interopRequireDefault(_chai);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_chai2.default.should(); // This enables should-style syntax

_gulp2.default.task("test-local", ["build"], function (cb) {
  _gulp2.default.src(_paths2.default.build.lib).pipe((0, _gulpIstanbul2.default)()) // Covering files
  .pipe(_gulpIstanbul2.default.hookRequire()) // Force `require` to return covered files
  .on("finish", function () {
    _gulp2.default.src(_paths2.default.build.spec).pipe((0, _gulpMocha2.default)()).pipe(_gulpIstanbul2.default.writeReports({ dir: __dirname + "/../", reporters: ["text-summary", "lcovonly"] })) // Creating the reports after tests ran
    //.pipe(istanbul.enforceThresholds({ thresholds: { global: 90 } })) // Enforce a coverage of at least 90%
    .on("end", cb);
  });
});