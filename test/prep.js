var should = require('should');

describe('Fiveby Tests', function(){

  before(function(){
    var config = {
      implicitWait: 5000,
      hubUrl: "http://127.0.0.1:4444/wd/hub",
      browsers: {
        chrome: 1
      },
      environment: "integration",
      properties: {
        user: {
          "local,development": "frank",
          "integration": "sue",
          "production": "scott"
        }
      }
    };
    global.fivebyConfig = null;
    process.env.fivebyopts = JSON.stringify(config);
    var fb = require('../index.js');
  });


  describe('Properties', function(){
    it('environment specific', function(){
      var props = propertyService.getProperties('default');
      'sue'.should.equal(props.get('user'));
    });

    it('seperate namespaces', function() {
      var props = propertyService.getProperties('another');
      props.set('integration', 'user', 'derper');
      'derper'.should.equal(props.get('user'));
    });
  });

});
