Fiveby makes is easier to write automated tests/suites. Here's the idea: don't worry about selenium (or it's config), don't worry about selenium JS api oddities, don't worry about mocha, just use fiveby:

var fiveby = require('fiveby'),
    five = new fiveby(/*same as all browsers*/);

five.run(function (browser) { //browser is driver if you are looking at selenium docs
  describe('Another Google Search in ' + browser.name, function () {
      it('should work', function (done) {
        browser.get('http://www.google.com');
        var searchBox = browser.findElement(by.name('q')); //notice webdriver.By connivence method
        searchBox.sendKeys('awesome');
        searchBox.getAttribute('value').then(function (value) {
          should.equal(value, 'awesome');
          done();
        });
      });
      after(function () {
        browser.quit();
      });
    });
});


Here are the apis that are automatically included:

Complete Selenium Javascript api:
http://selenium.googlecode.com/git/docs/api/javascript/index.html
(webdriver.By surfaced as global by for convience)

Complete Mocha BDD api:
describe(), it(), before(), after(), beforeEach(), and afterEach()
http://visionmedia.github.io/mocha

Full should api:
https://github.com/visionmedia/should.js
