/* global describe, it, before */

var proxyquire = require('proxyquire').noPreserveCache();
require('should');


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
        cb("from close");
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
      on: function (err, cb) {
        //cb();
      }
    };
  }
};


describe('selenium helper', function () {

  it('check should call fs.exists with jar name', function (done) {
    var SeleniumHelper = proxyquire('../lib/selenium', {'fs':fsStub});
    var sel = new SeleniumHelper();
    sel.check(function (bool) {
      bool.should.be.true;
      done();
    });
  });

  describe('download', function () {
    it('should be able to download the selemium jar', function (done) {
      var SeleniumHelper = proxyquire('../lib/selenium', {'fs':fsStub, 'http':httpStub});
      var sel = new SeleniumHelper();
      sel.download(function (testString) {
        testString.should.equal("from close");
        done();
      });
    });
    it('should unlink and cb error on http error');
  });


});
