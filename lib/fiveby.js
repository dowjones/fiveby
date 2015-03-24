/* global promise, run */
var webdriver = require('selenium-webdriver');
var Hook = require('mocha').Hook;
var tb = require('traceback');
var LogManager = require('./logManager');
var Helper = require('./helper');

//simplify webdriver usage
global.by = webdriver.By;
global.key = webdriver.Key;
global.promise = webdriver.promise;
global.bot = webdriver.error;

module.exports = fiveby;

function fiveby(config) {
  this.config = config;
  this.logManager = new LogManager();
}

//spin up local selenium server if none provided
fiveby.prototype.localServer = function () {
  if (global.serverPromise) {
    return global.serverPromise;
  } else if (!global.fivebyConfig.hubUrl && !this.config.hubUrl) {
    var helper = new Helper();
    global.serverPromise = helper.isJava()
      .then(helper.isJar)
      .then(helper.download)
      .then(this.runSeleniumServer.bind(this))
      .thenCatch(console.error);
    return global.serverPromise;
  } else {
    return webdriver.promise.fulfilled();
  }

};

fiveby.prototype.runSeleniumServer = function () {
  console.info('spinning up local server ...');
  var SeleniumServer = require('selenium-webdriver/remote').SeleniumServer;
  var server = new SeleniumServer(Helper.getLocation(), { port: 4444 });
  server.start();
  global.fivebyConfig.hubUrl = this.config.hubUrl = server.address();
  return this.config.hubUrl;
};

fiveby.prototype.runSuiteInBrowsers = function (test) {

  if (test.length === 0) { //bail if they don't want a browser
    return test();
  }

  var self = this;
  //ensure minimal configuration is provided
  if (!this.config.browsers) {
    return console.warn('No browsers provided, must provide at least one');
  }

  var file = tb()[2].path;

  //for each browser in the configuration
  Object.keys(this.config.browsers).forEach(function (elem) {

    //check if specific browser is valid in selenium
    if (!webdriver.Capabilities[elem]) {
      return console.warn('No such browser: %s', elem);
    }

    var lastPromise = global.testPromise || webdriver.promise.fulfilled();
    var testComplete = webdriver.promise.defer();
    global.testPromise = testComplete.promise;

    //create a driver per test file
    lastPromise.then(function () {

      // set options for current browser
      var capabilities = webdriver.Capabilities[elem]();

      var cap = self.config.browsers[elem];

      self.logManager.set({
        browserName: capabilities.caps_.browserName,
        harFileName: self.config.harFileName
      });

      if (typeof cap === 'object' && cap !== null) {
        Object.keys(cap).forEach(function (n) {
          capabilities.set(n, cap[n]);
        });
      }
      self.logManager.setAdditionalLogOptions(capabilities);

      //setup post driver step
      var promo = function () {
        var describe = test(driver);

        //register hooks with mocha
        self.registerHook('fiveby error handling', describe, 'beforeEach', function () {
          this.currentTest.parent.file = this.currentTest.file = file; //correct file name bug with async execution and mocha
          webdriver.promise.controlFlow().on('uncaughtException', function (e) { //map errors to test when appropriate
            if (this.currentTest) {
              this.currentTest.callback(e);
            } else {
              console.error('Failed in setup or teardown, test result may not be valid for this file'); //failed in non-test
              throw(e);
            }
          });
        });

        self.registerHook('fiveby cleanup', describe, 'afterAll', function () {
          testComplete.fulfill();
          self.logManager.onAfterHook(driver);

          if (driver.session_) { //in case the tests already killed the session
            return driver.quit();
          }
        });

        run();

        return webdriver.promise.fulfilled();
      };

      //build driver
      var driver = new webdriver.Builder()
        .usingServer(self.config.hubUrl)
        .withCapabilities(capabilities)
        .build();
      driver.name = elem;
      driver.manage().timeouts().implicitlyWait(self.config.implicitWait);

      webdriver.promise.controlFlow().execute(promo);

    });
  });
};

fiveby.prototype.registerHook = function (name, suite, hookarr, func) {
  var hook = new Hook(name, func);
  hook.parent = suite;
  if (suite && suite.ctx) {
    hook.ctx = suite.ctx;
  } else {
    console.error('ERROR: Please return test suite (describe) in the fiveby constructor callback.');
    return process.exit(2);
  }
  hook.timeout(5000);
  if (hookarr.indexOf('before') > -1) {
    suite['_' + hookarr].unshift(hook);
  } else {
    suite['_' + hookarr].push(hook);
  }
};
