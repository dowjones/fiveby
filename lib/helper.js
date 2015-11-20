/* global promise */

var exec = require('child_process').exec;
var http = require('http');
var fs = require('fs');
var path = require('path');
var util = require('util');
var mkdirp = require('mkdirp');

var version = '2.48.2';
var vparts = version.split('.');
var file = util.format('selenium-server-standalone-%s.jar', version);
var location = path.resolve(util.format('./node_modules/fiveby/%s', file));
var url = util.format('http://selenium-release.storage.googleapis.com/%s.%s/%s', vparts[0], vparts[1], file);

module.exports = selenium;

function selenium () {}

selenium.getLocation = function () {
  return location;
};

selenium.prototype.isJava = function () {
  var defered = promise.defer();
  exec('java -version', function (error, stdout, stderr) {
    if (error) {
      console.error( 'ERROR: You need java installed to spin up your own server.' );
      process.exit(3);
    } else {
      defered.fulfill(true);
    }
  });
  return defered.promise;
};

selenium.prototype.isJar = function (java) {
  var defered = promise.defer();
  fs.exists(location, function (exists) {
    defered.fulfill(exists && java);
  });
  return defered.promise;
};

selenium.prototype.download = function (exists) {
  if (exists) return promise.fulfilled();
  var defered = promise.defer();

  function failHttp(err) {
    console.error( 'ERROR: Failed to download selenium jar. ', err );
    fs.unlink(path);
    process.exit(4);
  }

  var request = http.get(url, function (response) {
    if (response.statusCode !== 200) {
      return failHttp(response.statusCode);
    }
    console.info('downloading selenium ...');
    mkdirp('./node_modules/fiveby', function (err) { //to help func testing
      if (err) console.error(err);
    });
    var file = fs.createWriteStream(location);
    response.pipe(file);
    file.on('finish', function () {
     file.close(function () {
       defered.fulfill(true);
     });
    });
  }).on('error', function (err) {
    failHttp(err);
  });
  return defered.promise;
};
