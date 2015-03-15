/* global describe, it, before, beforeEach */

var proxyquire = require('proxyquire').noPreserveCache();
require('should');

var fsStub = {
  readFileSync : function () {
    return '{"alpha": "omega", "disableBrowsers": true}';
  }
};

var processStubFail = {
  exec: function (command, cb) {
    cb("failed!");
  }
};

var processStubSucceed = {
  exec: function (command, cb) {
    cb();
  }
};

var helperStub = function () {};
helperStub.prototype.isJava=function () {
  //console.info('isJava');
  return {
    then:function (cb) {return cb();}
  };
};
helperStub.prototype.isJar=function () {
  //console.info('isJar');
  return {
    then:function (cb) {return cb();}
  };
};
helperStub.prototype.download=function () {
  //console.info('download');
  return {
    then:function (cb) {return cb.apply({config:{}});}
  };
};


describe('fiveby config', function () {

  beforeEach(function () {
    global.fivebyConfig = null;
    delete process.env.fivebyopts;
  });

  it("global config present", function () {
    global.fivebyConfig = {"browsers":{}, "hubUrl":"garbage"};
    var fb = proxyquire('../index', { 'fs': fsStub });
    var callCount = 0;
    fb({}, function (b) {
      callCount++;
    });
    callCount.should.equal(0);
  });

  it("browsers enabled", function () {
    process.env.fivebyopts = '{"browsers":{}, "hubUrl":"garbage", "disableBrowsers": false}';
    var fb = proxyquire('../index', { 'fs': fsStub });
    var callCount = 0;
    fb({}, function (b) {
      callCount++;
    });
    callCount.should.equal(0);
  });

  it('error from json', function (done) {
    process.env.fivebyopts = "//}}}";
    process.exit = function (code) {
      code.should.equal(1);
      done();
    };
    proxyquire('../index', { 'fs': fsStub });
  });

  it('configuration set by file', function () {
    proxyquire('../index', { 'fs': fsStub });
    global.fivebyConfig.alpha.should.equal("omega");
  });

  it("constructor argument variations", function () {
    var fb = proxyquire('../index', { 'fs': fsStub });
    var callCount = 0;
    fb({}, function () {
      callCount++;
    });
    fb(function () {
      callCount++;
    });
    callCount.should.equal(2);
  });
});

describe('fiveby hooks', function () {
  var fb;

  before(function () {
    var fiveby = require('../lib/fiveby');
    fb = new fiveby({hubUrl: true});
  });

  it('before', function () {
    var arr = ['mark'];
    fb.registerHook('derper', {ctx:'yup', "_before": arr}, 'before', function () {});
    arr.length.should.equal(2);
    arr[1].should.equal('mark');
  });

  it('after', function () {
    var arr = ['mark'];
    fb.registerHook('derper', {ctx:'yup', "_after": arr}, 'after', function () {});
    arr.length.should.equal(2);
    arr[0].should.equal('mark');
  });

  it('no describe', function (done) {
    process.exit = function (code) {
      code.should.equal(2);
      done();
    };
    fb.registerHook('derper', {"_after": []}, 'after', function () {});

  });

});

describe('fiveby local server', function () {
  it('works', function (done) {
    var count = 0;
    var webDriverStub = {

      SeleniumServer: function () {
        return {
          start: function () {
            count++;
          },
          address: function () {}
          };
      }

    };
    var fiveby = proxyquire('../lib/fiveby', { 'selenium-webdriver/remote': webDriverStub, './helper': helperStub});
    new fiveby({browsers:{}});
    count.should.equal(1);
    done();
  });
});

describe('runSuiteInBrowsers', function () {

  var webDriverStub = {

    SeleniumServer: function () {
      return {
        start: function () {},
        address: function () {return {then:function () {}};}
        };
    }

  };

  it('bad browser name', function (done) {
    var fiveby = proxyquire('../lib/fiveby', {'selenium-webdriver/remote': webDriverStub, './helper': helperStub});
    var fb = new fiveby({browsers:{shmul:1}});
    console.warn = function (msg, browser) {
      msg.should.equal("No such browser: %s");
      browser.should.equal("shmul");
      done();
    };
    fb.runSuiteInBrowsers(function (b) {});
  });

  it('no browsers provided', function (done) {
    var fiveby = proxyquire('../lib/fiveby', {'selenium-webdriver/remote': webDriverStub, './helper': helperStub});
    var fb = new fiveby({});
    console.warn = function (msg) {
      msg.should.equal("No browsers provided, must provide at least one");
      done();
    };
    fb.runSuiteInBrowsers(function (b) {});
  });

  it('browser 0 arg bail', function () {
    var fiveby = proxyquire('../lib/fiveby', {'selenium-webdriver/remote': webDriverStub, './helper': helperStub});
    var fb = new fiveby({browsers:{chrome:1}});
    fb.runSuiteInBrowsers(function () {});
  });

  it('exercise', function () {
    var fiveby = proxyquire('../lib/fiveby', { 'selenium-webdriver/remote': webDriverStub, './helper': helperStub, 'selenium-webdriver': {
      Builder: function () {
        return {
          usingServer: function () {
            return {
              withCapabilities: function () {
                return {
                  build: function () {
                    return {
                      manage: function () {
                        return {
                          timeouts: function () {
                            return {
                              implicitlyWait: function () {
                                return {

                                };
                              }
                            };
                          }
                        };
                      }
                    };
                  }
                };
              }
            };
          }
        };
      }
    }});
    var fb = new fiveby({browsers:{chrome:{"chromeOptions": {"args": ["--disable-extensions"]}}, ie: 1}});
    fb.registerHook = function (name, suite, hookarr, func) {
      func.apply({currentTest:{parent:{}}});
    };
    fb.runSuiteInBrowsers(function (b) {});
  });
});
