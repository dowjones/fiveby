var proxyquire = require('proxyquire').noPreserveCache();

fsStub = {

  readFileSync : function(){
    return '{"alpha": "omega"}';
  }

};

webDriverStub = {

  SeleniumServer: function() {
    return {
      start: function(){},
      address: function(){}
      };
  }

};

var fb = proxyquire('../index', { 'fs': fsStub, 'selenium-webdriver/remote': webDriverStub});

describe('fiveby config', function(){
  it('configuration set by file', function(){
    global.fivebyConfig.alpha.should.equal("omega");
  });
  it('error from json', function(done){
    global.fivebyConfig = null;
    process.env.fivebyopts = "//}}}";
    process.exit = function(code){
      code.should.equal(1);
      done();
    };
    proxyquire('../index', { 'fs': fsStub, 'selenium-webdriver/remote': webDriverStub});
  });
});
