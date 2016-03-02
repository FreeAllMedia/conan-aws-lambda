"use strict";

var _gulp = require("gulp");

var _gulp2 = _interopRequireDefault(_gulp);

var _gulpUtil = require("gulp-util");

var _gulpUtil2 = _interopRequireDefault(_gulpUtil);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Watch tasks should depend on suppress-errors - it will force all stream pipes to print but not crash on error
_gulp2.default.task("suppress-errors", function () {
    function monkeyPatchPipe(o) {
        while (!o.hasOwnProperty("pipe")) {
            o = Object.getPrototypeOf(o);
            if (!o) {
                return;
            }
        }
        var originalPipe = o.pipe;
        var newPipe = function newPipe() {
            var result = originalPipe.apply(this, arguments);
            result.setMaxListeners(0);
            if (!result.pipe["monkey patched for suppress-errors"]) {
                monkeyPatchPipe(result);
            }

            return result.on("error", function (err) {
                _gulpUtil2.default.log(_gulpUtil2.default.colors.yellow(err));
                _gulpUtil2.default.beep();
                this.emit("end");
            });
        };
        newPipe["monkey patched for suppress-errors"] = true;
        o.pipe = newPipe;
    }
    monkeyPatchPipe(_gulp2.default.src(""));
});