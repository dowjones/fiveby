[Fiveby](http://en.wikipedia.org/wiki/Five_by_five)  
==========
[![npm](https://img.shields.io/npm/v/fiveby.svg)](http://npmjs.org/package/fiveby) [![build status](https://secure.travis-ci.org/dowjones/fiveby.png)](http://travis-ci.org/dowjones/fiveby) [![Join the chat at https://gitter.im/dowjones/fiveby](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/dowjones/fiveby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)

All the things you expect from a robust testing framework by neatly packaging: [WebDriverJS](https://code.google.com/p/selenium/wiki/WebDriverJs), [mocha](http://mochajs.org/), and [should](https://github.com/shouldjs/should.js) with a little glue and zero magic:

```javascript
var fiveby = require('fiveby');

fiveby(function (browser) {
  return describe('Google Search in ' + browser.name, function () {
      it('should work', function () {
        browser.get('http://www.google.com');
        var searchBox = browser.findElement(by.name('q'));
        searchBox.sendKeys('awesome');
        return searchBox.getAttribute('value').then(function (value) {
          'awesome'.should.equal(value);
        });
      });
    });
});
```
Add [gulp](http://gulpjs.com/) and some convention to make it even more powerful: [slush-fiveby](https://github.com/dowjones/slush-fiveby). slush-fiveby is a simple fiveby project generator/example.

###What's unique about fiveby?

- Cleanly allows mocha and webdriverjs to coexist
- MUCH simpler configuration and less boilerplate code
- [environment properties](/docs/properties.md)
- conveniences: api cleanup, spins up a selenium server if not provided, closes the browser for you, etc ...

###Configuration - fiveby-config.json

```json
{
  "implicitWait": 5000,
  "hubUrl": null,
  "browsers": {
    "firefox": true,
    "chrome": {
      "version": "37.0.2062.103",
      "chromeOptions": {
          "args": ["--disable-extensions"]
        }
    }
  },
  "disableBrowsers": false
}
```

disableBrowsers and hubUrl are optional, disableBrowsers defaults to false

###English?

#####Have little to no experience with end to end testing?

Ok, this tool will allow you to write a bit of javascript that will open any browser (even mobile), emulate user behavior via a few simple commands, and then verify what's displayed onscreen is correct. You can compile large suites of these tests and easily run them against many different browsers at once and get nice reports. It can be run with something like [jenkins](http://jenkins-ci.org/) to automate further.

###Pre-reqs

- [node.js](http://nodejs.org/)
- [mocha cli](http://mochajs.org/)
- [java](https://www.java.com/en/download/help/download_options.xml) (for selenium)

See [docs folder](/docs) for even more details!
