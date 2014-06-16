var webdriver = require('selenium-webdriver');
var Hook = require('mocha').Hook;
var path = require('path');
var fs = require('fs');
var stack = require('callsite');
require('should');

module.exports = fiveby;

//simplify webdriver.By usage
global.by = webdriver.By;

//get project configuration if one exists
if (!global.fivebyConfig) {
  var configPath = path.resolve('fiveby-config.json');
  var contents = {
    implicitWait: 5000,
    hubUrl: null,
    browsers: {chrome: 1}
  };
  try {
    contents = JSON.parse(fs.readFileSync(configPath, {encoding: 'utf-8'}));
  } catch (e) {
    console.info('No global config loaded %s', e);
  }
  global.fivebyConfig = contents;
  console.info('Configuration complete\n');
}

function fiveby(params, test) {

    if (arguments.length === 1) {
      test = params;
    } else {
      global.fivebyConfig = params; //TODO needs to be mixin
    }

    //ensure minimal configuration is provided
    if (!global.fivebyConfig.browsers) {
      console.error('No browsers provided, must provide at least one');
      return;
    }
    //for each browser in the configuration
    var results = [];

    Object.keys(global.fivebyConfig.browsers).forEach(function (elem) {
      //check if specific browser is valid in selenium;
      if (!webdriver.Capabilities[elem]) {
        console.error('No such browser: %s', elem);
        return;
      }
      //create a flowcontrol and driver per test file
      var control = webdriver.promise.createFlow(function () {
        var driver = new webdriver.Builder().withCapabilities(webdriver.Capabilities[elem]()).build();
        driver.name = elem;
        driver.manage().timeouts().implicitlyWait(global.fivebyConfig.implicitWait); //this is how long find operations will wait without specific configuration
        var describe = test(driver);
        var hook = new Hook('fiveby cleanup', function (done) {
          driver.quit().then(done);
        });
        hook.parent = describe;
        hook.ctx = describe.ctx;
        describe._afterAll.push(hook);
      });
      results.push(control);
    });

    it('Loading test file: ' + stack()[1].getFileName(), function (done) {
      webdriver.promise.all(results).then(function () {})
      .thenCatch(function (e) { console.log('ERROR: %s', e.stack); })
      .thenFinally(function () { done(); });
    });

  }
