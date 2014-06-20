var webdriver = require('selenium-webdriver');
var Hook = require('mocha').Hook;
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
require('should');

module.exports = fiveby;

//simplify webdriver usage
global.by = webdriver.By;
global.promise = webdriver.promise;

global.builder = true;

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

//spin up local selenium server if none provided
if (!global.fivebyConfig.hubUrl) {
  console.info("No server defined, spinning one up ...");
  SeleniumServer = require('selenium-webdriver/remote').SeleniumServer;
  var server = new SeleniumServer('./node_modules/fiveby/selenium-server-standalone-2.42.2.jar', { port: 4444 });
  server.start();
  global.fivebyConfig.hubUrl = server.address();
}

function fiveby(params, test) {

  if (arguments.length === 1) {//switch params for 1 arg
    test = params;
  } else {
    _.merge(global.fivebyConfig, params); //merge test params with global
  }

  //ensure minimal configuration is provided
  if (!global.fivebyConfig.browsers) {
    console.error('No browsers provided, must provide at least one');
    return;
  }

  if (!global.git) {
    global.git = webdriver.promise.defer();
    it('prepping tests...', function () {
      return global.git.promise;
    });
  }

  //for each browser in the configuration
  var flows = Object.keys(global.fivebyConfig.browsers).map(function (elem) {
    //check if specific browser is valid in selenium
    if (!webdriver.Capabilities[elem]) {
      console.error('No such browser: %s', elem);
      return;
    }
    return webdriver.promise.createFlow(function () {
      //create a control flow and driver per test file
      webdriver.promise.controlFlow().wait(function () { return global.builder; }).then(function () {
        global.builder = false;
        //build driver
        var driver = new webdriver.Builder().usingServer(global.fivebyConfig.hubUrl).withCapabilities(webdriver.Capabilities[elem]()).build();
        driver.name = elem;
        driver.manage().timeouts().implicitlyWait(global.fivebyConfig.implicitWait);

        //register tests with mocha
        var describe = test(driver);

        driver.session_.then(function () {
          global.git.fulfill();
        });

        //register hooks with mocha
        var afterhook = new Hook('fiveby cleanup', function (done) { //cleanup for developers
          global.builder = true;
          if (driver.session_) {
            driver.quit().then(done);
          } else {
            done();
          }
        });
        afterhook.parent = describe;
        afterhook.ctx = describe.ctx;
        afterhook.timeout = function () { return 5000; };
        describe._afterAll.push(afterhook);
      });

    });
  });

  webdriver.promise.all(flows)
    .then(function () {})
    .thenCatch(function (e) { console.log('%s', e); })
    .thenFinally(function () {});

}
