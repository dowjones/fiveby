[Fiveby](http://en.wikipedia.org/wiki/Five_by_five)
========

makes it easier to write automated tests/suites. Here's the idea: don't worry about selenium (or it's config), don't worry about selenium JS api oddities, don't worry about mocha, just use fiveby:
```javascript
var fiveby = require('fiveby');

new fiveby(function (browser) { //browser is driver if you are looking at selenium docs
  return describe('Google Search in ' + browser.name, function () {
      it('should work', function (done) {
        browser.get('http://www.google.com');
        var searchBox = browser.findElement(by.name('q')); //notice webdriver.By convenience method
        searchBox.sendKeys('awesome');
        searchBox.getAttribute('value').then(function (value) {
          'awesome'.should.equal(value);
          done();
        });
      });
    });
});
```
See [gulp-fiveby](https://github.dowjones.net/institutional/gulp-fiveby) for more realistic sample and project setup. Also [Factiva Automantion](https://github.dowjones.net/factivaautomation)

####Here are the apis that are automatically included:

Complete *Selenium Javascript* api:

> http://selenium.googlecode.com/git/docs/api/javascript/index.html
> (webdriver.By and webdriver.promise surfaced as globals for convience)

Complete *Mocha BDD* api:

> describe(), it(), before(), after(), beforeEach(), and afterEach()
> http://visionmedia.github.io/mocha

Full *should.js* api:

> https://github.com/shouldjs/should.js
