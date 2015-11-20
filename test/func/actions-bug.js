/* global promise, describe, it, before, beforeEach, by */
var fiveby = require('../../index');

fiveby(function (browser) {
  return describe('Google Search in ' + browser.name, function () {
      it('should work', function () {
        browser.get('http://www.google.com');
        var searchBox = browser.findElement(by.name('q'));
        browser.actions().mouseMove(searchBox).perform(); // this will break with regressions
        searchBox.sendKeys('awesome');
        return searchBox.getAttribute('value').then(function (value) {
          'awesome'.should.equal(value);
        });
      });
    });
});
