Common API Call Examples
---------

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

**Find multiple elements**

[Working example leveraging the page objects pattern](https://github.dowjones.net/institutional/gulp-fiveby/blob/master/tests/smoke/bootstrap.js)

**Complex mouses operations** using action chains:

```javascript
browser.actions().mouseDown(element).mouseMove(location).mouseUp().perform();
//a.k.a.
browser.actions().dragAndDrop(element,location).perform();
```
