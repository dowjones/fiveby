[Fiveby](http://en.wikipedia.org/wiki/Five_by_five)
========

makes it easier to write automated tests/suites. Here's the idea: don't worry about selenium (or it's config), don't worry about selenium JS api oddities, don't worry about mocha, just use fiveby:
```javascript
var fiveby = require('fiveby');

new fiveby(function (browser) { //browser is driver if you are looking at selenium docs
  return describe('Google Search in ' + browser.name, function () {
      it('should work', function () {
        browser.get('http://www.google.com');
        var searchBox = browser.findElement(by.name('q')); //notice webdriver.By convenience method
        searchBox.sendKeys('awesome');
        return searchBox.getAttribute('value').then(function (value) {
          'awesome'.should.equal(value);
        });
      });
    });
});
```
See [docs](https://github.dowjones.net/institutional/fiveby/docs) for more details and use [gulp-fiveby](https://github.dowjones.net/institutional/gulp-fiveby) as a scaffold project. [Live Help](https://dowjones.slack.com/messages/fiveby/)

###Configuration - fiveby-config.json

```json
{
  "implicitWait": 5000,
  "hubUrl": null,
  "browsers": {
    "chrome": 1
  },
  "disableBrowsers": false
}
```
disableBrowsers is optional, defaults to false

hubUrl is optional, if not provided (and disableBrowsers = false) it will spin up a selenium server *requires java*
