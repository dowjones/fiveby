var fs = require('fs');

module.exports = logManager;

function logManager() {
  this.browserName = '';

  this.har = {
    captureHar: false
  };
}

logManager.prototype.set = function (opts) {
  this.browserName = opts.browserName;

  this.har = {
    harFileName: opts.harFileName,
    captureHar: opts.harFileName && opts.browserName === 'phantomjs'? true : false
  };
};

logManager.prototype.isHarEnabled = function () {
  return this.har && this.har.captureHar;
};

logManager.prototype.setAdditionalLogOptions = function (capabilities) {
  if (this.isHarEnabled()) {
    capabilities.setLoggingPrefs({ har: 'ALL' });
  }
};

logManager.prototype.onAfterHook = function (driver) {
  var self = this;
  if (this.isHarEnabled()) {
    // write har file
    driver.manage().logs().get('har').then(function (logobject) {
      self.writeFile('./harfiles', self.har.harFileName, logobject[0].message);
    });
  }
};

logManager.prototype.writeFile = function (directoryPath, filename, message) {
  var fs = require('fs');

  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, 0766, function (err) {
      if (err) {
        console.error(err);
      }
    });
  }
  fs.writeFile(directoryPath + '/' + filename, message, function ( err ) {
    if (err) {
      console.error(err);
    } else {
      console.info('wrote ' + filename);
    }
  });
};
