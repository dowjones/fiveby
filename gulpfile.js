var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var coveralls = require('gulp-coveralls');
var smocha = require('gulp-spawn-mocha');
var mocha = require('gulp-mocha');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var print = require('gulp-print');
function test() {
  return gulp.src(['lib/*.js', 'index.js'])
    .pipe(istanbul())
    .pipe(istanbul.hookRequire())
    .on('finish', function () {
      gulp.src(['test/spec/*.js'])
        .pipe(mocha())
        .pipe(istanbul.writeReports({
          reporters: [ 'text', 'lcov', 'cobertura' ]
        })).on('end',function () {
          if (process.env.TRAVIS) {
            gulp.src('coverage/lcov.info')
              .pipe(coveralls()).on('error', function () {
                //swallow coveralls errors
              });
          }
        });
    });
}
//
// gulp.task('func', function () {
//   gulp.src(['test/func/*.js'])
//     .pipe(smocha({timeout: 30000, slow: 15000, 'delay': true}));
// });
//
// gulp.task('debug', function () {
//   gulp.src(['test/spec/*.js'])
//     .pipe(mocha());
// });
function style() {
  return gulp.src(['lib/*.js','test/**/*.js','index.js'])
    .pipe(jscs())
    .pipe(jshint())
    .pipe(jshint.reporter('jshint-stylish'))
    .pipe(jshint.reporter('fail'));
}
gulp.task('test', gulp.series(style, test));
gulp.task('style', style);
