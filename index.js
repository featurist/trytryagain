var originalSetTimeout = setTimeout;

module.exports = function(fn, options) {
  if (typeof options === 'function') {
    var opts = fn;
    fn = options;
    options = opts;
  }

  var timeout = options && options.hasOwnProperty('timeout') && options.timeout !== undefined? options.timeout: 1000;
  var interval = options && options.hasOwnProperty('interval') && options.interval !== undefined? options.interval: 10;

  var startTime = Date.now();

  function waitAndLoop(error) {
    return wait(interval).then(function () {
      return retryLoop(error);
    });
  }

  function retryLoop(lastError) {
    if (lastError && ((startTime + timeout) < Date.now())) {
      return Promise.reject(lastError);
    }

    var result;
    var error;

    try {
      result = fn();
    } catch(e) {
      error = e;
    }

    if (result && typeof result.then === 'function') {
      return result.then(undefined, waitAndLoop);
    } else if (error) {
      return waitAndLoop(error);
    } else {
      return Promise.resolve(result);
    }
  }

  return retryLoop();
};

module.exports.ensuring = function (fn, options) {
  if (typeof options === 'function') {
    var opts = fn;
    fn = options;
    options = opts;
  }

  var duration = options && options.hasOwnProperty('duration') && options.duration !== undefined? options.duration: 1000;
  var interval = options && options.hasOwnProperty('interval') && options.interval !== undefined? options.interval: 10;

  var startTime = Date.now();

  function waitAndLoop(result) {
    return wait(interval).then(function () {
      return retryLoop(result);
    });
  }

  function retryLoop(lastResult) {
    if (((startTime + duration) < Date.now())) {
      return Promise.resolve(lastResult);
    }

    var result;

    try {
      result = fn();
    } catch(e) {
      return Promise.reject(e);
    }

    if (result && typeof result.then === 'function') {
      return result.then(waitAndLoop);
    } else {
      return waitAndLoop(result);
    }
  }

  return retryLoop();
};

function wait(n) {
  return new Promise(function (fulfil) {
    originalSetTimeout(fulfil, n);
  });
}
