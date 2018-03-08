/* global describe, it, before, propertyService */

var proxyquire = require('proxyquire').noPreserveCache();

global.run = function () {};

describe('fiveby utils', function () {

  var fsStub = {

    readFileSync : function () {
      return '{"properties":{"alpha": "omega", "scott": "isaniceguy"}}';
    }

  };

  before(function () {
    var config = {
      implicitWait: 5000,
      hubUrl: 'http://127.0.0.1:4444/wd/hub',
      browsers: {
        chrome: 1
      },
      environment: 'integration',
      properties: {
        alpha: 'beta',
        user: {
          'local,development': 'frank',
          'integration': 'sue',
          'production': 'scott'
        }
      }
    };
    global.fivebyConfig = null;
    process.env.fivebyopts = JSON.stringify(config);
    proxyquire('../../index', { 'fs': fsStub });
  });

  it('environment specific', function () {
    var props = propertyService.get('default');
    'sue'.should.equal(props.get('user'));
  });

  it('environment specific w/ legacy api', function () {
    var props = propertyService.getProperties('default');
    'sue'.should.equal(props.get('user'));
  });

  it('seperate namespaces', function () {
    var props = propertyService.get('another');
    props.set('integration', 'user', 'derper');
    'derper'.should.equal(props.get('user'));
  });

  it('merges env properties over file defined', function () {
    var props = propertyService.get('default');
    'beta'.should.equal(props.get('alpha'));
    'isaniceguy'.should.equal(props.get('scott'));
  });


});
