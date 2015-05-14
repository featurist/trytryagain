# If at first you don't succeed, try try again

[![if at first you don't succeed, try try again](http://img.youtube.com/vi/WwlWgMTCp8w/0.jpg)](http://www.youtube.com/watch?v=WwlWgMTCp8w)

Retrying assertions is a very reliable strategy for testing applications, whether you're testing in the browser, on mobile, or testing networked applications. Anywhere timing is variable.

```JavaScript
var retry = require('trytryagain');

describe('my application', function () {
  it('has the right title', function () {

    return retry(function () {

      return browser.title().then(function (title) {
        return expect(title).to.equal('My App');
      });

    });

  });
});
```

## NPM: [trytryagain](https://www.npmjs.org/package/trytryagain)

```sh
npm install trytryagain
```

## retry

```JavaScript
var promise = retry(function, [options]);
var promise = retry([options], function);
```

* `function` is a function that will be called repeatedly until it doesn't throw an exception, or return a promise that is rejected.
* `options.timeout` millisecond to retry until giving up. default 1000.
* `options.interval` retry interval in milliseconds. default 10.

Returns a promise. If the function eventually returns a value then this promise will be fulfilled with that value. If the function continually throws or rejects, then this function will be rejected with the error.

## retry.ensuring

`retry.ensuring` is kind of the oppposite of `retry`, it keeps trying the assertion as long as it doesn't fail, and fails immediately if it fails. This is useful in situation where you want to ensure that something **doesn't** happen, but you want to check long enough to be sure.

```js
var promise = retry.ensuring(function, [options]);
var promise = retry.ensuring([options], function);
```

* `function` is a function that will be called repeatedly until it does throw an exception, or until `duration` milliseconds has passed.
* `options.duration` milliseconds to retry before declaring success. default 1000.
* `options.interval` retry interval in milliseconds. default 10.
