/* global promise */

var exec = require('child_process').exec;
var http = require('http');
var fs = require('fs');

var jar = 'selenium-server-standalone-2.44.0.jar';
var path = './node_modules/fiveby/';
var url = 'http://selenium-release.storage.googleapis.com/2.44/'+jar;

module.exports = selenium;

function selenium () {}

selenium.prototype.isJava = function () {
  var defered = promise.defer();
  exec('java -version', function (error, stdout, stderr) {
    if (error) {
      console.error( "You need java installed to spin up your own server." );
      return process.exit(3);
    } else {
      defered.fulfill(true);
    }
  });
  return defered.promise;
};

selenium.prototype.isJar = function (java) {
  var defered = promise.defer();
  fs.exists(jar, function (exists) {
    defered.fulfill(exists && java);
  });
  return defered.promise;
};

selenium.prototype.download = function (exists) {
  if (exists) return promise.fulfilled();
  var defered = promise.defer();
  var file = fs.createWriteStream(path+jar);
  var request = http.get(url, function (response) {
    response.pipe(file);
    file.on('finish', function () {
      file.close(function () {
        defered.fulfill(true);
      });
    });
  }).on('error', function (err) {
    fs.unlink(path);
    if (err) defered.reject(err.message);
  });
  return defered.promise;
};
