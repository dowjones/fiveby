var webdriver = require('selenium-webdriver');
var Hook = require('mocha').Hook;
var tb = require('traceback');

//simplify webdriver usage
global.by = webdriver.By;
global.key = webdriver.Key;
global.promise = webdriver.promise;
global.bot = webdriver.error;

if(!global.testPromise){
  global.testPromise = webdriver.promise.fulfilled();
}

module.exports = fiveby;

function fiveby(config) {
  this.config = config;
  //spin up local selenium server if none provided
  if (!global.fivebyConfig.hubUrl && !config.hubUrl) {
    console.info("No server defined, spinning one up ...");
    var SeleniumServer = require('selenium-webdriver/remote').SeleniumServer;
    var server = new SeleniumServer('./node_modules/fiveby/selenium-server-standalone-2.44.0.jar', { port: 4444 });
    server.start();
    global.fivebyConfig.hubUrl = config.hubUrl = server.address();
  }
}

fiveby.prototype.runSuiteInBrowsers = function (test) {

  if(test.length === 0){ //bail if they don't want a browser
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

    var lastPromise = global.testPromise;
    var testComplete = webdriver.promise.defer();
    global.testPromise = testComplete.promise;

    //create a driver per test file
    lastPromise.then(function() {

      // set options for current browser
      var capabilities = webdriver.Capabilities[elem]();

      var cap = self.config.browsers[elem];

      if (typeof cap === 'object' && cap !== null) {
        Object.keys(cap).forEach(function (n) {
          capabilities.set(n, cap[n]);
        });
      }

      //build driver
      var driver = new webdriver.Builder()
        .usingServer(self.config.hubUrl)
        .withCapabilities(capabilities)
        .build();
      driver.name = elem;
      driver.manage().timeouts().implicitlyWait(self.config.implicitWait);

      //register tests with mocha
      var describe = test(driver);

      //register hooks with mocha
      self.registerHook('fiveby error handling', describe, "beforeEach", function () {
        this.currentTest.parent.file = this.currentTest.file = file; //correct file name bug with async execution and mocha
        webdriver.promise.controlFlow().on('uncaughtException', function (e) { //map errors to test when appropriate
          if(this.currentTest) {
            this.currentTest.callback(e);
          } else {
            console.error("Failed in setup or teardown, test result may not be valid for this file"); //failed in non-test
            throw(e);
          }
        });
      });

      self.registerHook('fiveby cleanup', describe, "afterAll", function () {
        testComplete.fulfill();
        if (driver.session_) { //in case the tests already killed the session
          return driver.quit();
        }
      });

    });
  });
};

fiveby.prototype.registerHook = function (name, suite, hookarr, func) {
  var hook = new Hook(name, func);
  hook.parent = suite;
  if (suite && suite.ctx) {
    hook.ctx = suite.ctx;
  } else {
    console.error("Please return test suite (describe) in the fiveby constructor callback.");
    return process.exit(2);
  }
  hook.timeout(5000);
  if(hookarr.indexOf("before") > -1){
    suite["_" + hookarr].unshift(hook);
  } else {
    suite["_" + hookarr].push(hook);
  }
};
