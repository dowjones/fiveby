var proxyquire = require('proxyquire').noPreserveCache();

fsStub = {

  readFileSync : function(){
    return '{"alpha": "omega", "disableBrowsers": true}';
  }

};

describe('fiveby config', function(){
  var fb;

  beforeEach(function(){
    global.fivebyConfig = null;
    delete process.env.fivebyopts;
  });

  it("disable browsers", function(){
    process.env.fivebyopts = '{"browsers":{}, "hubUrl":"garbage"}';
    var fb = proxyquire('../index', { 'fs': fsStub });
    var callCount = 0;
    fb({}, function(){
      callCount++;
    });
    callCount.should.equal(0);
  });

  it('error from json', function(done){
    process.env.fivebyopts = "//}}}";
    process.exit = function(code){
      code.should.equal(1);
      done();
    };
    proxyquire('../index', { 'fs': fsStub });
  });

  it('configuration set by file', function(){
    proxyquire('../index', { 'fs': fsStub });
    global.fivebyConfig.alpha.should.equal("omega");
  });

  it("constructor argument variations", function(){
    var fb = proxyquire('../index', { 'fs': fsStub });
    var callCount = 0;
    fb({}, function(){
      callCount++;
    });
    fb(function(){
      callCount++;
    });
    callCount.should.equal(2);
  });
});

describe('fiveby hooks', function(){
  var fb;

  before(function(){
    var fiveby = require('../lib/fiveby');
    fb = new fiveby({hubUrl: true});
  });

  it('before', function(){
    var arr = ['mark'];
    fb.registerHook('derper', {ctx:'yup', "_before": arr}, 'before', function(){});
    arr.length.should.equal(2);
    arr[1].should.equal('mark');
  });

  it('after', function(){
    var arr = ['mark'];
    fb.registerHook('derper', {ctx:'yup', "_after": arr}, 'after', function(){});
    arr.length.should.equal(2);
    arr[0].should.equal('mark');
  });

  it('no describe', function(done){
    process.exit = function(code){
      code.should.equal(2);
      done();
    };
    fb.registerHook('derper', {"_after": []}, 'after', function(){});

  });

});

describe('fiveby local server', function(){
  it('works', function(){
    var count = 0;
    var webDriverStub = {

      SeleniumServer: function() {
        return {
          start: function(){count++;},
          address: function(){}
          };
      }

    };
    var fiveby = proxyquire('../lib/fiveby', { 'selenium-webdriver/remote': webDriverStub});
    fb = new fiveby({browsers:{}});
    count.should.equal(1);
  });
});

describe('exercise runSuiteInBrowsers', function(){
  it('works', function(){
    var webDriverStub = {

      SeleniumServer: function() {
        return {
          start: function(){},
          address: function(){return "nowhere";}
          };
      }

    };
    var fiveby = proxyquire('../lib/fiveby', { 'selenium-webdriver/remote': webDriverStub, 'selenium-webdriver': {
      Builder: function(){
        return {
          usingServer: function(){
            return {
              withCapabilities: function(){
                return {
                  build: function(){
                    return {
                      manage: function(){
                        return {
                          timeouts: function(){
                            return {
                              implicitlyWait: function(){
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
    fb = new fiveby({browsers:{chrome:1}});
    fb.registerHook = function(){};
    fb.runSuiteInBrowsers(function(){
      console.info("RAWR");
    });
  });
});
