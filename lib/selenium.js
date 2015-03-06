var http = require('http');
var fs = require('fs');

var jar = 'selenium-server-standalone-2.44.0.jar';
var path = './node_modules/fiveby/';
var url = 'http://selenium-release.storage.googleapis.com/2.44/'+jar;

module.exports = selenium;

function selenium () {}

selenium.prototype.check = function (cb) {
  fs.exists(jar, cb);
};

selenium.prototype.download = function (cb) {
  var file = fs.createWriteStream(path+jar);
  var request = http.get(url, function (response) {
    response.pipe(file);
    file.on('finish', function () {
      file.close(cb);
    });
  }).on('error', function (err) {
    fs.unlink(path);
    if (err) cb(err.message);
  });
};
