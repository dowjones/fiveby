/* global promise, run */
var webdriver = require('selenium-webdriver');
var Hook = require('mocha').Hook;
var stackTrace = require('stack-trace');
var LogManager = require('./logManager');
var Helper = require('./helper');

//simplify webdriver usage
global.by = webdriver.By;
global.key = webdriver.Key;
global.promise = webdriver.promise;
global.bot = webdriver.error;
global.until = webdriver.until;

module.exports = fiveby;

function fiveby(config) {
  this.config = config;
  this.logManager = new LogManager();
  this.file = stackTrace.get()[2].getFileName();
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
      .then(this.runSeleniumServer.bind(this));
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

      //har file logging
      self.logManager.set({
       browserName: capabilities.map_.browserName,
       harFileName: self.config.harFileName
      });

      if (typeof cap === 'object' && cap !== null) {
        Object.keys(cap).forEach(function (n) {
          capabilities.set(n, cap[n]);
        });
      }
      self.logManager.setAdditionalLogOptions(capabilities);

      //build driver
      var driver = new webdriver.Builder()
        .usingServer(self.config.hubUrl)
        .withCapabilities(capabilities)
        .build();
      driver.name = elem;
      driver.manage().timeouts().implicitlyWait(self.config.implicitWait);

      //hook and execute tests
      webdriver.promise.controlFlow().execute(function () {
        var describe = test(driver);

        self.registerHook(describe, 'beforeEach-first', function () {
          this.currentTest.parent.file = this.currentTest.file = self.file;
        });

        self.registerHook(describe, 'afterAll-first', function () {
          testComplete.fulfill(); //signal next file to run
          self.logManager.onAfterHook(driver);
        });

        self.registerHook(describe, 'afterAll-last', function () {
          if (driver.session_) { //in case the tests already killed the session
            return driver.quit();
          }
        });

        run(); //TODO: this cannot be good?!

        return webdriver.promise.fulfilled();
      });

    });
  });
};

fiveby.prototype.registerHook = function (suite, pos, func) {
  var hook = new Hook('fiveby '+pos+' hook', func);

  pos = pos.split('-');
  var key = pos[0];
  var loc = pos[1];

  hook.parent = suite;
  if (suite && suite.ctx) {
    hook.ctx = suite.ctx;
  } else {
    console.error('ERROR: Please return test suite (describe) in the fiveby constructor callback.');
    return process.exit(2);
  }

  hook.timeout(5000);

  if (loc === 'first') {
    suite['_' + key].unshift(hook);
  } else {
    suite['_' + key].push(hook);
  }
};
