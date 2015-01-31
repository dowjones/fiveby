var gulp = require('gulp');
var istanbul = require('gulp-istanbul');
var coveralls = require('gulp-coveralls');
var mocha = require('gulp-mocha');

gulp.task('test', function (cb) {
  gulp.src(['lib/fiveby.js', 'index.js'])
    .pipe(istanbul())
    .on('finish', function () {
      gulp.src(['test/*.js'])
        .pipe(mocha())
        .pipe(istanbul.writeReports({
          reporters: [ 'text', 'lcov', 'cobertura' ]
        })).on('end',function(){
          if (process.env.TRAVIS) {
            gulp.src('coverage/lcov.info')
              .pipe(coveralls());
          }
        });
    });
});
