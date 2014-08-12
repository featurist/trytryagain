(function() {
    var Promise = require("bluebird");
    var gen1_promisify = function(fn) {
        return new Promise(function(onFulfilled, onRejected) {
            fn(function(error, result) {
                if (error) {
                    onRejected(error);
                } else {
                    onFulfilled(result);
                }
            });
        });
    };
    var self = this;
    var wait;
    module.exports = function(fn, gen2_options) {
        var self = this;
        var timeout, interval;
        timeout = gen2_options !== void 0 && Object.prototype.hasOwnProperty.call(gen2_options, "timeout") && gen2_options.timeout !== void 0 ? gen2_options.timeout : 1e3;
        interval = gen2_options !== void 0 && Object.prototype.hasOwnProperty.call(gen2_options, "interval") && gen2_options.interval !== void 0 ? gen2_options.interval : 10;
        var startTime, retryLoop, gen3_asyncResult;
        return new Promise(function(gen4_onFulfilled) {
            startTime = new Date().getTime();
            retryLoop = function() {
                var gen5_asyncResult;
                return new Promise(function(gen4_onFulfilled) {
                    gen4_onFulfilled(new Promise(function(gen4_onFulfilled) {
                        gen4_onFulfilled(Promise.resolve(fn()));
                    }).then(void 0, function(e) {
                        var now, gen6_asyncResult;
                        return new Promise(function(gen4_onFulfilled) {
                            now = new Date().getTime();
                            gen4_onFulfilled(Promise.resolve(function() {
                                if (now < startTime + timeout) {
                                    return new Promise(function(gen4_onFulfilled) {
                                        gen4_onFulfilled(Promise.resolve(wait(interval)).then(function(gen7_asyncResult) {
                                            gen7_asyncResult;
                                            return Promise.resolve(retryLoop());
                                        }));
                                    });
                                } else {
                                    throw e;
                                }
                            }()));
                        });
                    }));
                });
            };
            gen4_onFulfilled(Promise.resolve(retryLoop()));
        });
    };
    wait = function(n) {
        return new Promise(function(gen4_onFulfilled) {
            gen4_onFulfilled(gen1_promisify(function(gen8_callback) {
                return setTimeout(gen8_callback, n);
            }));
        });
    };
}).call(this);