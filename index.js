var webdriver = require('selenium-webdriver');
var Hook = require('mocha').Hook;
var path = require('path');
var fs = require('fs');
require('should');

module.exports = fiveby;

//simplify webdriver.By usage
global.by = webdriver.By;
global.promise = webdriver.promise;

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
      global.fivebyConfig = params; //TODO should be mixin
    }

    //ensure minimal configuration is provided
    if (!global.fivebyConfig.browsers) {
      console.error('No browsers provided, must provide at least one');
      return;
    }

    var results = [];
    //for each browser in the configuration
    Object.keys(global.fivebyConfig.browsers).forEach(function (elem) {
      //check if specific browser is valid in selenium;
      if (!webdriver.Capabilities[elem]) {
        console.error('No such browser: %s', elem);
        return;
      }
      //create a flowcontrol and driver per test file
      var control = webdriver.promise.createFlow(function () {
        var builder = new webdriver.Builder();
        if (global.fivebyConfig.hubUrl) {
          builder.usingServer(global.fivebyConfig.hubUrl);
        }
        var driver = builder.withCapabilities(webdriver.Capabilities[elem]()).build();
        driver.name = elem;
        driver.manage().timeouts().implicitlyWait(global.fivebyConfig.implicitWait); //this is how long find operations will wait without specific configuration
        var describe = test(driver);
        var hook = new Hook('fiveby cleanup', function (done) { //cleanup for developers
          driver.quit().then(done);
        });
        hook.parent = describe;
        hook.ctx = describe.ctx;
        describe._afterAll.push(hook);
      });
      results.push(control);
    });

    if (!global.oneit) {
      it('Loaded your tests!', function (done) { //let the developers know what's loaded and hold mocha/node open while promises are registered to control flow
        webdriver.promise.fullyResolved(results).then(function () {})
        .thenCatch(function (e) { console.log('ERROR: %s', e.stack); })
        .thenFinally(function () { done(); });
      });
      global.oneit = true;
    } else {
      webdriver.promise.fullyResolved(results).then(function () {})
      .thenCatch(function (e) { console.log('ERROR: %s', e.stack); })
      .thenFinally(function () {});
    }

  }
