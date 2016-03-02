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
export default class FlowSync {
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
  static parallel(...options) {
    async.parallel(...options);
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
  static eachParallel(...options) {
    async.each(...options);
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
  static eachSeries(...options) {
    async.eachSeries(...options);
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
  static mapParallel(...options) {
    async.map(...options);
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
  static series(...options) {
    async.series(...options);
  }

	/**
	 * [waterfall description]
	 * @param  {[type]} ...options [description]
	 * @return {[type]}            [description]
	 */
	static waterfall(...options) {
    async.waterfall(...options);
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
  static mapSeries(...options) {
    async.mapSeries(...options);
  }
}
