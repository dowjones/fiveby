/* global describe, it, before, assert, promise */
var proxyquire = require('proxyquire').noPreserveCache();
var webdriver = require('selenium-webdriver');

var fsStub = {
  existsSync: function () {
    return false;
  },
  mkdirSync: function (path, perm, cb) {
    cb('muhaha');
  },
  writeFile: function (name, message, cb) {
    cb();
  }
};

var LogManager = proxyquire('../../lib/logManager', {'fs':fsStub});

describe('logManager', function () {
  var logMgr;

  before(function () {
    logMgr = new LogManager();

  });

  it('is not har enabled by default', function (done) {
    logMgr.har.captureHar.should.equal(false);
    logMgr.isHarEnabled().should.equal(false);
    done();
  });

  it('is not har enabled if phantom is not enabled', function (done) {
    logMgr.set({harFileName: 'myFile', browserName:'chrome'});
    logMgr.isHarEnabled().should.equal(false);
    done();
  });

  it('adds to log options if har is enabled', function (done) {
    var capabilities = webdriver.Capabilities.phantomjs();
    logMgr.set({harFileName: 'myFile.har', browserName:'phantomjs'});
    logMgr.setAdditionalLogOptions(capabilities);
    capabilities.caps_.loggingPrefs.har.should.equal('ALL');
    done();
  });

  it('does not add to har log options if har is not enabled', function (done) {
    var capabilities = webdriver.Capabilities.chrome();
    logMgr.set({harFileName: 'myFile', browserName:'chrome'});
    logMgr.setAdditionalLogOptions(capabilities);
    (typeof capabilities.caps_.loggingPrefs).should.equal('undefined');
    done();
  });

  it('writes a har file to the correct directory when it is enabled', function (done) {
    var date = new Date(),
      fileMessage = 'logging data at ' + date.getTime().toString(),
      webDriverStub = {
      manage: function () {
        return { logs: function () {
          return { get: function () {
            return new promise.fulfilled([{ message: fileMessage }]);
          }};
        }};
      }
    };

    logMgr.set({harFileName: 'myFile.har', browserName:'phantomjs'});
    logMgr.onAfterHook(webDriverStub);
    done();
  });
});
