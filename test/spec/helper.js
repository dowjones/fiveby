/* global describe, it, before */

var proxyquire = require('proxyquire').noPreserveCache();
var helperLocation = '../../lib/helper';
var Helper = require(helperLocation);
require('should');

var processStubFail = {
  exec: function (command, cb) {
    cb('failsauce');
  }
};

var processStub = {
  exec: function (command, cb) {
    cb();
  }
};

var fsStub = {

  exists : function (jar, cb) {
    if (jar.indexOf(Helper.getLocation()) > -1) {
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
      statusCode: 200,
      pipe: function () {}
    });
    return {
      on: function (err, cb) {}
    };
  }
};

var httpStubFail = {
  get: function (url, cb) {
    cb({
      statusCode: 200,
      pipe: function () {}
    });
    return {
      on: function (err, cb) {
        cb({message:'shiz blew up'});
      }
    };
  }
};

var httpStubFail2 = {
  get: function (url, cb) {
    cb({
      statusCode: 404,
      pipe: function () {}
    });
    return {
      on: function (err, cb) {}
    };
  }
};


describe('selenium helper', function () {

  it('isJar should call fs.exists with jar name', function () {
    var SeleniumHelper = proxyquire(helperLocation, {'fs':fsStub});
    var sel = new SeleniumHelper();
    return sel.isJar(true).then(function (result) {
      result.should.equal(true);
    });
  });

  describe('isJava', function () {

    it('should die if java is not installed', function (done) {
      var SeleniumHelper = proxyquire(helperLocation, {'child_process':processStubFail});
      var sel = new SeleniumHelper();
      process.exit = function (code) {
       code.should.equal(3);
       done();
      };
      sel.isJava();
    });

    it('should return true if java exists', function () {
      var SeleniumHelper = proxyquire(helperLocation, {'child_process':processStub});
      var sel = new SeleniumHelper();
      return sel.isJava().then(function (result) {
        result.should.equal(true);
      });
    });

  });

  describe('download tests', function () {
    it('should be able to download the selenium jar', function () {
      var SeleniumHelper = proxyquire(helperLocation, {'fs':fsStub, 'http':httpStub});
      var sel = new SeleniumHelper();
      return sel.download().then(function (result) {
        result.should.equal(true);
      });
    });
    it('should be fail to download the selemium jar on non 200', function (done) {
      var SeleniumHelper = proxyquire(helperLocation, {'fs':fsStub, 'http':httpStubFail2});
      var sel = new SeleniumHelper();
      process.exit = function (code) {
       code.should.equal(4);
       done();
      };
      sel.download();
    });
    it('should unlink and cb error on http error', function (done) {
      var SeleniumHelper = proxyquire(helperLocation, {'fs':fsStub, 'http':httpStubFail});
      var sel = new SeleniumHelper();
      process.exit = function (code) {
       code.should.equal(4);
       done();
      };
      sel.download();
    });
    it('should fulfill if file exists', function () {
      var SeleniumHelper = proxyquire(helperLocation, {});
      var sel = new SeleniumHelper();
      return sel.download(true);
    });
  });


});
