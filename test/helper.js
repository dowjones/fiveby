/* global describe, it, before */

var proxyquire = require('proxyquire').noPreserveCache();
require('should');

var processStubFail = {
  exec: function (command, cb) {
    cb('failsauce');
  }
};

var fsStub = {

  exists : function (jar, cb) {
    if (jar === 'selenium-server-standalone-2.44.0.jar') {
      cb(true);
    } else {
      cb(false);
    }
  },

  createWriteStream : function () {
    return {
      on: function (name, cb) {
        cb();
      },
      close: function (cb) {
        cb();
      }
    };
  },

  unlink : function () {

  }

};

var httpStub = {
  get: function (url, cb) {
    cb({
      pipe: function () {}
    });
    return {
      on: function (err, cb) {}
    };
  }
};

var httpStubFail = {
  get: function (url, cb) {
    return {
      on: function (err, cb) {
        cb({message:'shiz blew up'});
      }
    };
  }
};


describe('selenium helper', function () {

  it('isJar should call fs.exists with jar name', function () {
    var SeleniumHelper = proxyquire('../lib/helper', {'fs':fsStub});
    var sel = new SeleniumHelper();
    return sel.isJar(true).then(function (result) {
      result.should.equal(true);
    });
  });

  it('should die if java is not installed', function (done) {
    var SeleniumHelper = proxyquire('../lib/helper', {'fs':fsStub, 'child_process':processStubFail});
    var sel = new SeleniumHelper();
    process.exit = function (code) {
     code.should.equal(3);
     done();
    };
    sel.isJava();
   });

  describe('download tests', function () {
    it('should be able to download the selemium jar', function () {
      var SeleniumHelper = proxyquire('../lib/helper', {'fs':fsStub, 'http':httpStub});
      var sel = new SeleniumHelper();
      return sel.download().then(function (result) {
        result.should.equal(true);
      });
    });
    it('should unlink and cb error on http error', function () {
      var SeleniumHelper = proxyquire('../lib/helper', {'fs':fsStub, 'http':httpStubFail});
      var sel = new SeleniumHelper();
      return sel.download().then(function (result) {}, function (error) {
        error.should.equal('shiz blew up');
      });
    });
  });


});
