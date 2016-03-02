'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/* Dependencies */
var async = require('async');

/**
 * # FlowSync
 *
 * Manage serial/parallel flow-control and iteration.
 *
 * ## Why Not Use FlowSync.js Directly?
 *
 * FlowSync.js provides a lot of great functionality, but at 5k gzipped, it's hard to justify the entire library when all we need are a few flow-control and iteration methods. This is especially true now that FAM has switched to browserify, as any superfluous code delivered to the client is undesireable.
 *
 * FlowSync currently wraps FlowSync.js so that it can be replaced with lean, specialized functions at a later time. For now, it is only a wrapper for FlowSync.js that provides an immutable standard interface.
 *
 * # Static Functions
 *
 * ## FlowSync.parallel(functionCollection, callback)
 *
 * ```javascript
 * FlowSync.parallel(functionCollection, functionsCompleted);
 *
 * var functionCollection = [
 *   functionOne, // Called at same time as functionTwo
 *   functionTwo // Called at same time as functionOne
 * ]
 *
 * function functionOne(callback) {
 *   console.log('functionOne started');
 *   setTimeout(completed, 5000);
 *   function completed(){
 *     console.log('functionOne finished');
 *     callback();
 *   }
 * }
 *
 * function functionTwo(callback) {
 *   console.log('functionTwo started');
 *   setTimeout(completed, 3000);
 *   function completed(){
 *     console.log('functionTwo finished');
 *     callback();
 *   }
 * }
 *
 * function functionsCompleted() {
 *   console.log('all functions completed.');
 * }
 * ```
 *
 * ## FlowSync.series(functionCollection, callback)
 *
 * ```javascript
 * FlowSync.series(functionCollection, functionsCompleted);
 *
 * var functionCollection = [
 *   functionOne, // Called first
 *   functionTwo // Called after functionOne completes
 * ]
 *
 * function functionOne(callback) {
 *   console.log('functionOne started');
 *   setTimeout(completed, 5000);
 *   function completed(){
 *     console.log('functionOne finished');
 *     callback();
 *   }
 * }
 *
 * function functionTwo(callback) {
 *   console.log('functionTwo started');
 *   setTimeout(completed, 3000);
 *   function completed(){
 *     console.log('functionTwo finished');
 *     callback();
 *   }
 * }
 *
 * function functionsCompleted() {
 *   console.log('all functions completed.');
 * }
 * ```
 *
 * ## FlowSync.mapSeries(values, iterator, callback)
 *
 * ```javascript
 * FlowSync.mapSeries(values, iteratorFunction, iterationsCompleted);
 *
 * var values = [1, 2, 3];
 *
 * // This iteratorFunction will be called once per value, in serial order of the values
 * function iteratorFunction(value, callback) {
 *    callback(value + 1);
 * }
 *
 * function iterationsCompleted(error, results) {
 *   if (error) { throw error; }
 *   results; // [2, 3, 4]
 *   console.log('iterator has completed all values. The new values are: ' + toString(results));
 * }
 * ```
 *
 * ## FlowSync.mapParallel(values, iterator, callback)
 *
 * ```javascript
 * FlowSync.mapParallel(values, iteratorFunction, iterationsCompleted);
 *
 * var values = [1, 2, 3];
 *
 * // This iteratorFunction will be called once per value, in parallel of one another
 * function iteratorFunction(value, callback) {
 *    callback(value + 1);
 * }
 *
 * function iterationsCompleted(error, results) {
 *   if (error) { throw error; }
 *   results; // [2, 3, 4]
 *   console.log('iterator has completed all values. The new values are: ' + toString(results));
 * }
 * ```
 *
 * @class FlowSync
 * @static
 */

var FlowSync = function () {
  function FlowSync() {
    _classCallCheck(this, FlowSync);
  }

  _createClass(FlowSync, null, [{
    key: 'parallel',

    /* Static Interface */

    /**
    * Calls each function provided in parallel, then calls callback when all functions have completed.
    *
    * @method parallel
    * @static
    * @param {Array.<Function>} functionCollection Array of Functions to be called in serial order.
    * @param {Function} callback
    *
    * @example
    *
    * ```javascript
    * FlowSync.parallel(functionCollection, functionsCompleted);
    *
    * var functionCollection = [
    *   functionOne, // Called at same time as functionTwo
    *   functionTwo // Called at same time as functionOne
    * ]
    *
    * function functionOne(callback) {
    *   console.log('functionOne started');
    *   setTimeout(completed, 5000);
    *   function completed(){
    *     console.log('functionOne finished');
    *     callback();
    *   }
    * }
    *
    * function functionTwo(callback) {
    *   console.log('functionTwo started');
    *   setTimeout(completed, 3000);
    *   function completed(){
    *     console.log('functionTwo finished');
    *     callback();
    *   }
    * }
    *
    * function functionsCompleted() {
    *   console.log('all functions completed.');
    * }
    * ```
    */
    value: function parallel() {
      async.parallel.apply(async, arguments);
    }

    /**
    * Calls the provided iterator function once for each item in parallel.
    * @method eachParallel
    * @static
    * @param {Array} array to iterate
    * @param {Function} iterator function
    * @param {Function} callback called after the iteration
    * @example
    *
    * ```javascript
    * var items = [1,2,3];
    * function callback(error, result) {
    *   //some final code
    * }
    * function iteratorFunction(item, finishStep) {
    *   //some code
    *   finishStep(error, result);
    * }
    * FlowSync.eachParallel(items, iteratorFunction, callback);
    * ```
    */

  }, {
    key: 'eachParallel',
    value: function eachParallel() {
      async.each.apply(async, arguments);
    }

    /**
    * Calls the provided iterator function once for each item in series.
    * @method eachSeries
    * @static
    * @param {Array} array to iterate
    * @param {Function} iterator function
    * @param {Function} callback called after the iteration
    * @example
    *
    * ```javascript
    * var items = [1,2,3];
    * function callback(error, result) {
    *   //some final code
    * }
    * function iteratorFunction(item, finishStep) {
    *   //some code
    *   finishStep(error, result);
    * }
    * FlowSync.eachSeries(items, iteratorFunction, callback);
    * ```
    */

  }, {
    key: 'eachSeries',
    value: function eachSeries() {
      async.eachSeries.apply(async, arguments);
    }

    /**
    * Calls provided iterator function with each element of the array as an argument, and produces a new array.
    *
    * @method mapParallel
    * @static
    * @param {Array.<Function>} functionCollection Array of Functions to be called in serial order.
    * @param {Function} iterator Function that each element of Array is passed to
    * @param {Function} callback
    *
    * @example
    *
    * ```javascript
    * FlowSync.mapParallel(values, iteratorFunction, iterationsCompleted);
    *
    * var values = [1, 2, 3];
    *
    * // This iteratorFunction will be called once per value, in parallel of one another
    * function iteratorFunction(value, callback) {
    *    callback(value + 1);
    * }
    *
    * function iterationsCompleted(error, results) {
    *   if (error) { throw error; }
    *   results; // [2, 3, 4]
    *   console.log('iterator has completed all values. The new values are: ' + toString(results));
    * }
    * ```
    */

  }, {
    key: 'mapParallel',
    value: function mapParallel() {
      async.map.apply(async, arguments);
    }

    /**
    * Calls each function provided in serial order, then calls callback.
    *
    * @method series
    * @static
    * @param {Array.<Function>} functionCollection Array of Functions to be called in serial order.
    * @param {Function} callback
    *
    * @example
    *
    * ```javascript
    * FlowSync.series(functionCollection, functionsCompleted);
    *
    * var functionCollection = [
    *   functionOne, // Called first
    *   functionTwo // Called after functionOne completes
    * ]
    *
    * function functionOne(callback) {
    *   console.log('functionOne started');
    *   setTimeout(completed, 5000);
    *   function completed(){
    *     console.log('functionOne finished');
    *     callback();
    *   }
    * }
    *
    * function functionTwo(callback) {
    *   console.log('functionTwo started');
    *   setTimeout(completed, 3000);
    *   function completed(){
    *     console.log('functionTwo finished');
    *     callback();
    *   }
    * }
    *
    * function functionsCompleted() {
    *   console.log('all functions completed.');
    * }
    * ```
    */

  }, {
    key: 'series',
    value: function series() {
      async.series.apply(async, arguments);
    }

    /**
     * [waterfall description]
     * @param  {[type]} ...options [description]
     * @return {[type]}            [description]
     */

  }, {
    key: 'waterfall',
    value: function waterfall() {
      async.waterfall.apply(async, arguments);
    }

    /**
    * Calls provided iterator function with each element of the array as an argument, in serial order.
    *
    * @method mapSeries
    * @static
    * @param {Array.<Function>} functionCollection Array of Functions to be called in serial order.
    * @param {Function} iterator Function that each element of Array is passed to
    * @param {Function} callback
    *
    * @example
    *
    * ```javascript
    * FlowSync.mapSeries(values, iteratorFunction, iterationsCompleted);
    *
    * var values = [1, 2, 3];
    *
    * // This iteratorFunction will be called once per value, in serial order of the values
    * function iteratorFunction(value, callback) {
    *    callback(value + 1);
    * }
    *
    * function iterationsCompleted(error, results) {
    *   if (error) { throw error; }
    *   results; // [2, 3, 4]
    *   console.log('iterator has completed all values. The new values are: ' + toString(results));
    * }
    * ```
    */

  }, {
    key: 'mapSeries',
    value: function mapSeries() {
      async.mapSeries.apply(async, arguments);
    }
  }]);

  return FlowSync;
}();

exports.default = FlowSync;