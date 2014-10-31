var proxyquire = require('proxyquire').noPreserveCache();

fsStub = {

  readFileSync : function(){
    return '{"alpha": "omega", "hubUrl":"steve"}';
  }

};

var fb = proxyquire('../index', { 'fs': fsStub });

describe('FiveBy Config', function(){
  it('configuration set by file', function(){
    global.fivebyConfig.should.eql({alpha:"omega", hubUrl:"steve"});
  });
});
