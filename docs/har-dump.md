To capture the HTML Archive (HAR) file, add 'harFileName' attribute to options sent in with the test file.

#### Sample
```javascript
var fiveby = require('fiveby');

fiveby( { harFileName: 'googlesearch.har' }, function (browser) {
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

Phantomjs must be enabled for tests to capture the HTTP tracing information.
The files will appear under the ./harfiles directory.
