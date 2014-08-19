var webdriver = require('selenium-webdriver');
var Hook = require('mocha').Hook;
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var tb = require('traceback');
var Properties = require('./lib/properties');
require('should');

module.exports = fiveby;

//simplify webdriver usage
global.by = webdriver.By;
global.key = webdriver.Key;
global.promise = webdriver.promise;

//get project configuration if one exists
if (!global.fivebyConfig) {

  if (process.env.fivebyopts) {
    global.fivebyConfig = JSON.parse(process.env.fivebyopts);
  } else {
    var configPath = path.resolve('fiveby-config.json');
    try {
      global.fivebyConfig = JSON.parse(fs.readFileSync(configPath, {encoding: 'utf-8'}));
    } catch (e) {
      console.error('No global config loaded %s', e);
      process.exit(1);
    }
  }

  //prep properties
  global.propertyService = new Properties(global.fivebyConfig.environment||'local');
  var props = global.propertyService.getProperties('default');
  props.setMany(global.fivebyConfig.properties||{});

  global.testPromise = webdriver.promise.fulfilled();
  console.info('Configuration complete');

}

//spin up local selenium server if none provided
if (!global.fivebyConfig.hubUrl) {
  console.info("No server defined, spinning one up ...");
  SeleniumServer = require('selenium-webdriver/remote').SeleniumServer;
  var server = new SeleniumServer('./node_modules/fiveby/selenium-server-standalone-2.42.2.jar', { port: 4444 });
  server.start();
  global.fivebyConfig.hubUrl = server.address();
}

//main test driver
function fiveby(params, test) {

  var file = tb()[1].path;

  if (arguments.length === 1) {//switch params for 1 arg
    test = params;
  } else {
    _.merge(global.fivebyConfig, params); //merge test params with global
  }

  //ensure minimal configuration is provided
  if (!global.fivebyConfig.browsers) {
    return console.warn('No browsers provided, must provide at least one');
  }

  //for each browser in the configuration
  Object.keys(global.fivebyConfig.browsers).forEach(function (elem) {

    //check if specific browser is valid in selenium
    if (!webdriver.Capabilities[elem]) {
      return console.warn('No such browser: %s', elem);
    }

    var lastPromise = global.testPromise;
    var testComplete = webdriver.promise.defer();
    global.testPromise = testComplete.promise;

    //create a control flow and driver per test file
    lastPromise.then(function() {
      //build driver
      var driver = new webdriver.Builder()
        .usingServer(global.fivebyConfig.hubUrl)
        .withCapabilities(webdriver.Capabilities[elem]())
        .build();
      driver.name = elem;
      driver.manage().timeouts().implicitlyWait(global.fivebyConfig.implicitWait);

      //register tests with mocha
      var describe = test(driver);

      //register hooks with mocha
      registerHook('fiveby error handling', describe, "beforeEach", function () {
        this.currentTest.parent.file = this.currentTest.file = file;
        webdriver.promise.controlFlow().on('uncaughtException', function (e) {
          this.currentTest.callback(e);
        });
      });

      registerHook('fiveby cleanup', describe, "afterAll", function () { // this hook should clear promise that
        testComplete.fulfill();
        if (driver.session_) { //in case the tests already killed the session
          return driver.quit();
        }
      });

    });
  });
}

function registerHook(name, suite, hookarr, func) {
  var hook = new Hook(name, func);
  hook.parent = suite;
  if (suite && suite.ctx) {
    hook.ctx = suite.ctx;
  } else {
    console.error("Please return test suite (describe) in the fiveby constructor callback.");
    process.exit(2);
  }
  hook.timeout(5000);
  if(hookarr.indexOf("before") > -1){
    suite["_" + hookarr].unshift(hook);
  } else {
    suite["_" + hookarr].push(hook);
  }
}
