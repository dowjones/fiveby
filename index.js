//TODO: make fiveby it's own library and the users can setup just gulp from example (maybe a generator?)
var webdriver = require('selenium-webdriver'),
  SeleniumServer = require('selenium-webdriver/remote').SeleniumServer,
  test = require('selenium-webdriver/testing'),
  should = require('should'),  //global automatically?
  path = require('path');

//TODO: add chrome driver(s) to this bundle as well and make it executable on target system
var server = new SeleniumServer(path.resolve('./node_modules/fiveby/selenium-server-standalone-2.41.0.jar'), {
  port: 4444
});

//TODO: expose should
function fiveby(params) {
  this.drivers = [];
  if (!params || (params && params.browsers)) {

    if (!params || params.browsers.firefox) {
      try {
        server.start();
        var ffDriver = new webdriver.Builder().usingServer(server.address()).withCapabilities(webdriver.Capabilities.firefox()).build();
        ffDriver.name = 'firefox';
        ffDriver.manage().timeouts().implicitlyWait(30 * 1000);
        this.drivers.push(ffDriver);
      } catch (e) {
        console.log(e);
      }
    }

    if (!params || params.browsers.chrome) {
      try {
        var chromeDriver = new webdriver.Builder().withCapabilities(webdriver.Capabilities.chrome()).build();
        chromeDriver.name = 'chrome';
        chromeDriver.manage().timeouts().implicitlyWait(30 * 1000);
        this.drivers.push(chromeDriver);
      } catch (e) {
        console.log(e);
      }
    }
  }
}

fiveby.prototype.run = function (test) {
  this.drivers.forEach(function (driver) {
    test(driver);
  });
};

fiveby.prototype.quit = function () {
  this.drivers.forEach(function (driver) {
      driver.quit();
    });
};

global.by = webdriver.By;

module.exports = fiveby;
