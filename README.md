[Fiveby](http://en.wikipedia.org/wiki/Five_by_five) [![Join the chat at https://gitter.im/dowjones/fiveby](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/dowjones/fiveby?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
==========
[![npm](https://img.shields.io/npm/v/fiveby.svg?style=flat)](http://npmjs.org/package/fiveby) [![build status](https://secure.travis-ci.org/dowjones/fiveby.svg)](http://travis-ci.org/dowjones/fiveby) [![Code Climate](https://codeclimate.com/github/dowjones/fiveby/badges/gpa.svg)](https://codeclimate.com/github/dowjones/fiveby) [![Coverage Status](https://coveralls.io/repos/dowjones/fiveby/badge.svg?branch=master)](https://coveralls.io/r/dowjones/fiveby?branch=master)

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
#### Run it (quick)
```
mocha tests/** --delay --timeout 30000
```
#### OR (recommended)
Add [gulp](http://gulpjs.com/) and some convention to make it even more powerful: [slush-fiveby](https://github.com/dowjones/slush-fiveby). slush-fiveby is a simple fiveby project generator/example.

### What's unique about fiveby?

- Cleanly allows mocha and webdriverjs to coexist
- MUCH simpler configuration and less boilerplate code
- [environment properties](/docs/properties.md)
- conveniences: api cleanup, spins up a selenium server if not provided, closes the browser for you, etc ...
- [Sends test traffic to a HAR file](/docs/har-dump.md)
- [more](/docs/comparisons.md)

### Configuration - fiveby-config.json

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
    },
    "phantomjs": true
  },
  "disableBrowsers": false
}
```

disableBrowsers and hubUrl are optional, disableBrowsers defaults to false

*Use phantomjs 2.0: http://phantomjs.org/download.html

### English?

##### Have little to no experience with end to end testing?

Ok, this tool will allow you to write a bit of javascript that will open any browser (or mobile app), emulate user behavior via a few simple commands, and then verify what's displayed onscreen is correct. You can compile large suites of these tests and easily run them against many different browsers at once and get nice reports. It can be run with something like [jenkins](http://jenkins-ci.org/) to automate further. Or use any of the popular SaaS providers like:

[![Sauce Labs](https://saucelabs.com/images/sauce-labs-logo.png)](http://saucelabs.com) [![BrowserStack](https://d2ogrdw2mh0rsl.cloudfront.net/production/images/mail/browserstack-logo-footer.png)](http://browserstack.com) <a href="http://testingbot.com/"><img src="https://testingbot.com/assets/logo.png" height="60" width="120" ></a>

### Pre-reqs

- [node.js](http://nodejs.org/)
- [mocha cli](http://mochajs.org/)
- [java](https://www.java.com/en/download/help/download_options.xml) (for selenium)
- the appropriate [webdriver](http://www.seleniumhq.org/projects/webdriver/)

See [docs folder](/docs) for even more details!
