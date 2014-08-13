# If at first you don't succeed, try try again

[![if at first you don't succeed, try try again](http://img.youtube.com/vi/WwlWgMTCp8w/0.jpg)](http://www.youtube.com/watch?v=WwlWgMTCp8w)

Retrying assertions is a very reliable strategy for testing applications, whether your testing web or mobile apps, or network applications.

    var retry = require('trytrytryagain');

    describe('my application', function () {
      it('has the right title', function () {

        return retry(function () {

          return browser.title().then(function (title) {
            return expect(title).to.equal('My App');
          });

        });

      });
    });

## retry

    var promise = retry(function, [options]);

Where:

  * `function` is a function that will be called repeatedly until it doesn't throw an exception, or return a promise that is rejected.
  * `options`:
    * `timeout` millisecond to retry until giving up. default 1000.
    * `interval` retry interval in milliseconds. default 10.

Returns a promise. If the function eventually returns a value then this promise will be fulfilled with that value. If the function continually throws or rejects, then this function will be rejected with the error.
