"use strict";

var flowsync = require("../lib/flowsync.js");
var sinon = require("sinon");

describe("flowsync", function () {
	"use strict";

	var clock = undefined;

	beforeEach(function () {
		clock = sinon.useFakeTimers();
	});

	afterEach(function () {
		clock.restore();
	});

	it("should work as a module", function () {
		var fsync = require("../../index");
		(typeof fsync.series === "function").should.be.true;
	});

	describe("(example usage)", function () {
		describe("(ES6)", function () {
			it("should work as expected", function (done) {
				flowsync.series([function (next) {
					//do something
					setTimeout(next, 1);
				}, function (next) {
					setTimeout(next, 1);
				}], function (error, results) {
					//do something after the series
					done();
				});

				clock.tick(5);
			});
		});

		describe("(ES5)", function () {
			it("should work as expected", function (done) {
				flowsync.series([function stepOne(next) {
					//do something
					setTimeout(next, 1);
				}, function stepTwo(next) {
					setTimeout(next, 1);
				}], function finalStep(error, results) {
					//do something after the series
					done();
				});

				clock.tick(5);
			});
		});
	});

	describe("flowsync.parallel(functionCollection, callback)", function () {
		var functionOne = undefined,
		    functionTwo = undefined,
		    functionThree = undefined,
		    functionCollection = undefined,
		    callback = undefined;

		beforeEach(function () {

			functionOne = sinon.spy();
			functionTwo = sinon.spy();
			functionThree = sinon.spy();

			functionCollection = [function (ready) {
				functionOne();
				setTimeout(ready, 100); // Timeout is to determine whether parallel or serial
			}, function (ready) {
				functionTwo();
				setTimeout(ready, 100); // Timeout is to determine whether parallel or serial
			}, function (ready) {
				functionThree();
				setTimeout(ready, 100); // Timeout is to determine whether parallel or serial
			}];

			callback = sinon.spy();
		});

		it("should call each function from functionCollection in parallel", function () {
			flowsync.parallel(functionCollection);

			// Because there's a timeout, this would fail if it was run in serial order
			functionOne.called.should.be.true;
			functionTwo.called.should.be.true;
			functionThree.called.should.be.true;

			clock.tick(100);
		});

		it("should make a callback when all functions have completed", function (done) {
			flowsync.parallel(functionCollection, done);
			clock.tick(100);
		});
	});

	describe("flowsync.eachParallel(array, iteratorFunction, callback)", function () {
		var iteratorFunction = undefined,
		    itemSpy = undefined,
		    items = undefined,
		    callback = undefined,
		    array = undefined;

		beforeEach(function () {
			items = [1, 2, 3];

			itemSpy = sinon.spy(function (item, finish) {
				finish();
			});

			iteratorFunction = function iteratorFunction(item, finish) {
				itemSpy(item, finish);
			};

			callback = sinon.spy();
		});

		it("should call the function for each item and then the callback", function (done) {
			flowsync.eachParallel(items, iteratorFunction, function () {
				sinon.assert.callCount(itemSpy, 3);
				done();
			});
		});

		it("should call the function until an error occurs and then the callback with that error", function (done) {
			var errorData = "someerror";
			itemSpy = sinon.spy(function (item, finish) {
				finish(errorData);
			});
			flowsync.eachParallel(items, iteratorFunction, function (error) {
				error.should.eql(errorData);
				done();
			});
		});
	});

	describe("flowsync.eachSeries(array, iteratorFunction, callback)", function () {
		var iteratorFunction = undefined,
		    itemSpy = undefined,
		    items = undefined,
		    callback = undefined,
		    array = undefined;

		beforeEach(function () {
			items = [0, 1, 2];

			itemSpy = [sinon.spy(function (item, finish) {
				setTimeout(finish, 1);
			}), sinon.spy(function (item, finish) {
				setTimeout(finish, 1);
			}), sinon.spy(function (item, finish) {
				setTimeout(finish, 1);
			})];

			iteratorFunction = function iteratorFunction(item, finish) {
				itemSpy[item](item, finish);
			};

			callback = sinon.spy();
		});

		it("should call the function for each item and then the callback", function (done) {
			flowsync.eachSeries(items, iteratorFunction, function () {
				sinon.assert.callOrder(itemSpy[0], itemSpy[1], itemSpy[2]);
				done();
			});

			clock.tick(5);
		});

		it("should call the function until an error occurs and then the callback with that error", function (done) {
			var errorData = "someerror";
			itemSpy[1] = sinon.spy(function (item, finish) {
				finish(errorData);
			});
			flowsync.eachSeries(items, iteratorFunction, function (error) {
				error.should.eql(errorData);
				done();
			});

			clock.tick(5);
		});
	});

	describe("flowsync.series(functionCollection, callback)", function () {
		var functionOne = undefined,
		    functionTwo = undefined,
		    functionThree = undefined,
		    functionCollection = undefined,
		    callback = undefined;

		beforeEach(function () {
			functionOne = sinon.spy();
			functionTwo = sinon.spy();
			functionThree = sinon.spy();

			functionCollection = [function (ready) {
				functionOne();
				setTimeout(ready, 100); // Timeout is to determine whether parallel or serial
			}, function (ready) {
				functionTwo();
				setTimeout(ready, 100); // Timeout is to determine whether parallel or serial
			}, function (ready) {
				functionThree();
				setTimeout(ready, 100); // Timeout is to determine whether parallel or serial
			}];

			callback = sinon.spy();
		});

		it("should call each function from functionCollection in serial order", function (done) {
			flowsync.series(functionCollection, seriesComplete);

			function seriesComplete() {
				functionOne.called.should.be.true;
				functionTwo.called.should.be.true;
				functionThree.called.should.be.true;

				functionOne.calledBefore(functionTwo).should.be.true;
				functionTwo.calledBefore(functionThree).should.be.true;
				done();
			}

			// Because there's a timeout, this would fail if it was run in parallel
			functionTwo.called.should.be.false;
			functionThree.called.should.be.false;

			clock.tick(300);
		});

		it("should make a callback when all functions have completed", function (done) {
			flowsync.series(functionCollection, done);
			clock.tick(300);
		});
	});

	describe("flowsync.waterfall(functionCollection, callback)", function () {
		var functionOne = undefined,
		    functionTwo = undefined,
		    functionThree = undefined,
		    functionCollection = undefined,
		    callback = undefined;

		beforeEach(function () {
			functionOne = sinon.spy(function (callback) {
				callback(null, "1", "2");
			});

			functionTwo = sinon.spy(function (argumentOne, argumentTwo, callback) {
				callback(null, "3");
			});

			functionThree = sinon.spy(function (argumentOne, callback) {
				callback(null);
			});

			functionCollection = [functionOne, functionTwo, functionThree];

			callback = sinon.spy();
		});

		it("should call the first function from functionCollection", function (done) {
			flowsync.waterfall(functionCollection, seriesComplete);
			function seriesComplete() {
				functionOne.called.should.be.true;
				done();
			}
		});

		it("should call the second function from functionCollection, passing the results of function one as arguments", function (done) {
			flowsync.waterfall(functionCollection, seriesComplete);
			function seriesComplete() {
				functionTwo.calledWith("1", "2").should.be.true;
				done();
			}
		});
		it("should call the thirdCall function from functionCollection, passing the results of function two as arguments", function (done) {
			flowsync.waterfall(functionCollection, seriesComplete);
			function seriesComplete() {
				functionThree.calledWith("3").should.be.true;
				done();
			}
		});

		it("should make a callback when all functions have completed", function (done) {
			flowsync.waterfall(functionCollection, done);
		});
	});

	describe("flowsync.mapParallel(values, iterator, callback)", function () {
		var values = undefined,
		    iterator = undefined,
		    iteratorWrapper = undefined;

		beforeEach(function () {
			values = [1, 2, 3];
			iterator = sinon.spy();
			iteratorWrapper = function iteratorWrapper(value, completed) {
				iterator(value);
				setTimeout(completed, 100);
			};
		});

		it("should call the iterator with each value from values in parallel", function (done) {
			flowsync.mapParallel(values, iteratorWrapper, done);

			// Because there's a timeout, this would fail if it was run in serial order
			values.forEach(function (value) {
				iterator.calledWith(value).should.be.true;
			});

			clock.tick(100);
		});

		it("should make a callback when all iterator calls have completed", function (done) {
			flowsync.mapParallel(values, iteratorWrapper, done);
			clock.tick(100);
		});
	});

	describe("flowsync.mapSeries(values, iterator, callback)", function () {
		var values = undefined,
		    iterator = undefined,
		    iteratorWrapper = undefined;

		beforeEach(function () {
			values = [1, 2, 3];
			iterator = sinon.spy();
			iteratorWrapper = function iteratorWrapper(value, completed) {
				iterator(value);
				setTimeout(completed, 100);
			};
		});

		it("should call the iterator with each value from values in serial order", function (done) {
			flowsync.mapSeries(values, iteratorWrapper, iteratorComplete);

			function iteratorComplete() {
				iterator.firstCall.calledWith(1).should.be.true;
				iterator.secondCall.calledWith(2).should.be.true;
				iterator.thirdCall.calledWith(3).should.be.true;
				done();
			}

			// Because there's a timeout, this would fail if it was run in parallel order
			iterator.neverCalledWith(2).should.be.true;
			iterator.neverCalledWith(3).should.be.true;

			clock.tick(300);
		});

		it("should make a callback when all iterator calls have completed", function (done) {
			flowsync.mapSeries(values, iteratorWrapper, done);
			clock.tick(300);
		});
	});
});