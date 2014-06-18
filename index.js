var webdriver = require('selenium-webdriver');
var Hook = require('mocha').Hook;
var path = require('path');
var fs = require('fs');
require('should');

module.exports = fiveby;

//simplify webdriver usage
global.by = webdriver.By;
global.promise = webdriver.promise;

global.build = 0;

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

  if (arguments.length === 1) {//switch params for 1 arg
    test = params;
  } else {
    global.fivebyConfig = params; //TODO should be mixin
  }

  //ensure minimal configuration is provided
  if (!global.fivebyConfig.browsers) {
    console.error('No browsers provided, must provide at least one');
    return;
  }

  if (!global.wait) {
    global.wait = webdriver.promise.defer();
    it('getting tests ready', function () {
      return global.wait.promise;
    });
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
      webdriver.promise.controlFlow().wait(function () {return global.build < 3; }).then(function () {
        global.wait.fulfill();
        global.build++;
        var driver = builder.withCapabilities(webdriver.Capabilities[elem]()).build();
        driver.name = elem;
        driver.manage().timeouts().implicitlyWait(global.fivebyConfig.implicitWait);
        var describe = test(driver);

         //register test with mocha
        var beforehook = new Hook('fiveby start', function (done) { //but don't let them start until promise is fufilled
          driver.session_.then(function () {
            global.build--;
            done();
          });
        });
        var afterhook = new Hook('fiveby cleanup', function () { //cleanup for developers
          return driver.quit();
        });
        beforehook.parent = afterhook.parent = describe;
        beforehook.ctx =  afterhook.ctx = describe.ctx;
        beforehook.timeout = function() { return 1000*60; };
        describe._beforeAll.push(beforehook);
        describe._afterAll.push(afterhook);
      });
    });

    results.push(control);

  });

  webdriver.promise.all(results).then(function () {})
  .thenCatch(function (e) { console.log('ERROR: %s', e.stack); })
  .thenFinally(function () {});

}
