/* global promise, describe, it, before, beforeEach, after */

var proxyquire = require('proxyquire').noPreserveCache();

global.run = function () {};

var webDriverStub = {
  Builder: function () {
    return {
      usingServer: function () {
        return {
          withCapabilities: function () {
            return {
              build: function () {
                return {
                  'session_':true,
                  quit: function () {},
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
};

var webDriverStubFail = {
  Builder: function () {
    return {
      usingServer: function () {
        return {
          withCapabilities: function () {
            return {
              build: function () {
                return {
                  'session_':false,
                  quit: function () {},
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
};

var fsStub = {
  readFileSync : function () {
    return '{"alpha": "omega", "disableBrowsers": true}';
  }
};

var processStubFail = {
  exec: function (command, cb) {
    cb('failed!');
  }
};

var processStubSucceed = {
  exec: function (command, cb) {
    cb();
  }
};

var helperStub = function () {};
helperStub.prototype.isJava=function () {
  return {
    then:function (cb) {return cb();}
  };
};
helperStub.prototype.isJar=function () {
  return {
    then:function (cb) {return cb();}
  };
};
helperStub.prototype.download=function () {
  return {
    then:function (cb) {return cb.apply({config:{}});}
  };
};

var fbStub = function () {};
fbStub.prototype.localServer=function () {
  return {
    then:function (cb) {}
  };
};
fbStub.prototype.runSuiteInBrowsers=function () {};



describe('fiveby config', function () {

  beforeEach(function () {
    global.fivebyConfig = null;
    delete process.env.fivebyopts;
  });

  it('global config present', function () {
    global.fivebyConfig = {'browsers':{}, 'hubUrl':'garbage', 'disableBrowsers': true};
    var fb = require('../../index');
    var callCount = 0;
    fb({}, function (b) {
      callCount++;
    });
    callCount.should.equal(1);
  });

  it('browsers enabled', function () {
    process.env.fivebyopts = '{"browsers":{}, "hubUrl":"garbage", "disableBrowsers": false}';
    var fb = proxyquire('../../index', { 'fs': fsStub, './lib/fiveby': fbStub });
    var callCount = 0;
    fb({}, function (b) {
      callCount++;
    });
    callCount.should.equal(0);
  });

  it('error from json', function (done) {
    process.env.fivebyopts = '//}}}';
    process.exit = function (code) {
      code.should.equal(1);
      done();
    };
    proxyquire('../../index', { 'fs': fsStub });
  });

  it('configuration set by file', function () {
    proxyquire('../../index', { 'fs': fsStub });
    global.fivebyConfig.alpha.should.equal('omega');
  });

  it('constructor argument variations', function () {
    var fb = proxyquire('../../index', { 'fs': fsStub });
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
    var fiveby = require('../../lib/fiveby');
    fb = new fiveby({hubUrl: true});
  });

  it('before', function () {
    var arr = ['mark'];
    fb.registerHook({ctx:'yup', '_before': arr}, 'before-first', function () {});
    arr.length.should.equal(2);
    arr[1].should.equal('mark');
  });

  it('after', function () {
    var arr = ['mark'];
    fb.registerHook({ctx:'yup', '_after': arr}, 'after-last', function () {});
    arr.length.should.equal(2);
    arr[0].should.equal('mark');
  });

  it('no describe', function (done) {
    process.exit = function (code) {
      code.should.equal(2);
      done();
    };
    fb.registerHook({'_after': []}, 'after-first', function () {});
  });

});

describe('fiveby local server', function () {

  // it('works', function () {
  //   var count = 0;
  //   var webDriverStubRemote = {
  //     SeleniumServer: function () {
  //       return {
  //         start: function () {
  //           this.count++;
  //         },
  //         address: function () {
  //           return {
  //             then:function (cb) {return cb();},
  //             thenCatch:function (cb) {return {then:function () {}};}
  //           };
  //         }
  //       };
  //     }
  //   };
  //
  //   var fiveby = proxyquire('../../lib/fiveby', { 'selenium-webdriver/remote': webDriverStubRemote, './helper': helperStub});
  //   var fb = new fiveby({browsers:{}});
  //   return fb.localServer().then(function () {
  //     count.should.equal(1);
  //   });
  //
  // });

  it('should bail if they don\'t need a server', function () {
    var count = 0;
    var webDriverStubRemote = {
      SeleniumServer: function () {
        return {
          start: function () {
            this.count++;
          },
          address: function () {
            return {
              then:function (cb) {return cb();},
              thenCatch:function (cb) {return {then:function () {}};}
            };
          }
        };
      }
    };

    var fiveby = proxyquire('../../lib/fiveby', { 'selenium-webdriver/remote': webDriverStubRemote, './helper': helperStub});
    var fb = new fiveby({browsers:{}});
    global.fivebyConfig.hubUrl='http://sample.stuff.xyz';
    global.serverPromise = null;
    return fb.localServer().then(function () {
      count.should.equal(0);
    });

  });

  it('skips duplicate server creation', function () {
    var count = 0;
    var webDriverStubRemote = {
      SeleniumServer: function () {
        return {
          start: function () {
            this.count++;
          },
          address: function () {
            return {
              then:function (cb) {return cb();},
              thenCatch:function (cb) {return {then:function () {}};}
            };
          }
        };
      }
    };

    var fiveby = proxyquire('../../lib/fiveby', { 'selenium-webdriver/remote': webDriverStubRemote, './helper': helperStub});
    var fb = new fiveby({browsers:{}});
    global.serverPromise = promise.fulfilled();
    return fb.localServer().then(function () {
      count.should.equal(0);
    });
  });
});

describe('runSuiteInBrowsers', function () {

  var webDriverStubRemote = {
    SeleniumServer: function () {
      return {
        start: function () {},
        address: function () {return {then:function () {}};}
        };
    }
  };

  it('bad browser name', function (done) {
    var fiveby = proxyquire('../../lib/fiveby', {'selenium-webdriver/remote': webDriverStubRemote, './helper': helperStub});
    var fb = new fiveby({browsers:{shmul:1}});
    console.warn = function (msg, browser) {
      msg.should.equal('No such browser: %s');
      browser.should.equal('shmul');
      done();
    };
    fb.runSuiteInBrowsers(function (b) {});
  });

  it('no browsers provided', function (done) {
    var fiveby = proxyquire('../../lib/fiveby', {'selenium-webdriver/remote': webDriverStubRemote, './helper': helperStub});
    var fb = new fiveby({});
    console.warn = function (msg) {
      msg.should.equal('No browsers provided, must provide at least one');
      done();
    };
    fb.runSuiteInBrowsers(function (b) {});
  });

  it('browser 0 arg bail', function () {
    var fiveby = proxyquire('../../lib/fiveby', {'selenium-webdriver/remote': webDriverStubRemote, './helper': helperStub});
    var fb = new fiveby({browsers:{chrome:1}});
    fb.runSuiteInBrowsers(function () {});
  });

  it('exercise', function () {
    var fiveby = proxyquire('../../lib/fiveby', { 'selenium-webdriver/remote': webDriverStubRemote, './helper': helperStub, 'selenium-webdriver': webDriverStub});
    var fb = new fiveby({browsers:{chrome:{'chromeOptions': {'args': ['--disable-extensions']}}, ie: 1}});
    fb.registerHook = function (suite, hookarr, func) {
      func.apply({currentTest:{parent:{}}});
    };
    fb.runSuiteInBrowsers(function (b) {});
  });

  it('exercise alt', function () { //refactor anyone =)
    var fiveby = proxyquire('../../lib/fiveby', { 'selenium-webdriver/remote': webDriverStubRemote, './helper': helperStub, 'selenium-webdriver': webDriverStubFail});
    var fb = new fiveby({browsers:{chrome:{'chromeOptions': {'args': ['--disable-extensions']}}, ie: 1}});
    promise.controlFlow = function () {
      return {
        execute: function (cb) {
          cb();
        },
        on: function (event, cb) {
          cb.apply({currentTest:{
            callback: function (e) {
              e.should.equal('blarpy');
            }
          }}, ['blarpy']);
        }
      };
    };
    fb.registerHook = function (suite, hookarr, func) {
      func.apply({currentTest:{parent:{}}});
    };
    //fb.runSuiteInBrowsers(function (b) {});
  });

  after(function(){
    process.exit = function () {};
  });

});
