Common API Call Examples
---------

**Find a single element**
```javascript
var something = browser.findElement({css:'.something'}); //something is a promise
```

**Type in an element/input**
```javascript
something.sendKeys('else');
```

**Find multiple elements**

[Working example leveraging the page objects pattern](https://github.dowjones.net/institutional/gulp-fiveby/blob/master/tests/smoke/bootstrap.js)

**Complex mouses operations** using action chains:

```javascript
browser.actions().mouseDown(element).mouseMove(location).mouseUp().perform();
//a.k.a.
browser.actions().dragAndDrop(element,location).perform();
```

**Set a custom wait for findElement(s), use judiciously**
```javascript
browser.manage().timeouts().implicitlyWait(10000);
//do something
browser.manage().timeouts().implicitlyWait(5000);
//if you forget to reset the timeout it will only effect the remaining tests in same file
```

**Wait** for a condition to be true before moving on with a test, selenium api calls following this call will not be executed until the wait completes (see [control flows](https://code.google.com/p/selenium/wiki/WebDriverJs#Control_Flows)):

```javascript
/*
 * wait understands booleans, they can be directly returned or the result of a promise
 */
browser.wait(function() {
 return driver.getTitle().then(function(title) {
   return title === 'webdriver';
 });
}, 1000); //wait for the result to be true or 1 second, this overrides implcit wait
```

**Switch to frame or window**

http://selenium.googlecode.com/git/docs/api/javascript/class_webdriver_WebDriver_TargetLocator.html

Promise Stuff
-------

**promise.all** - takes an array of promises and returns a single promise that resolves when every promise in that array resolves. It contains the values of those promises, think async.parallel
```javascript
//if p1 resolves to "one" and p2 resolves to "two"
Promise.all([p1, p2]).then(function(values) {
  // values == [ "one", "two" ]
});
```

**promise.map** - run each value of the array (or promise that returns array) through a function, return an array of altered values. If the return value of the mapping function is a promise, this function will wait for it to be fulfilled before inserting it into the new array.

Can be useful even without resulting array, again see: [Working example leveraging the page objects pattern](https://github.dowjones.net/institutional/gulp-fiveby/blob/master/tests/smoke/bootstrap.js)

**promise.when** - used when you want to make a regular value into a promise, or not sure whether a promise or value, see: http://selenium.googlecode.com/git/docs/api/javascript/namespace_webdriver_promise.html

Links
------

**Overview of the WebDriver:** https://code.google.com/p/selenium/wiki/WebDriverJs

**Full API:** http://selenium.googlecode.com/git/docs/api/javascript/index.html

When looking at selenium pages *driver = browser*.
