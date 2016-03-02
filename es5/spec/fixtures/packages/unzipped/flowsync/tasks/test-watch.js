"use strict";

var _gulp = require("gulp");

var _gulp2 = _interopRequireDefault(_gulp);

var _paths = require("../paths.json");

var _paths2 = _interopRequireDefault(_paths);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_gulp2.default.task("test-watch", ["suppress-errors"], function () {
  _gulp2.default.watch([_paths2.default.source.lib, _paths2.default.source.spec, _paths2.default.source.specAssets, _paths2.default.source.libAssets], ["test-local"]);
});