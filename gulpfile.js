var gulp = require('gulp');
var webpackStream = require('webpack-stream');
var jasmineBrowser = require('gulp-jasmine-browser');
var UglifyJsPlugin = webpackStream.webpack.optimize.UglifyJsPlugin;

gulp.task('test', function () {
  return gulp.src('./spec/*-spec.js')
    .pipe(webpackStream({ output: { filename: 'spec.js' } }))
    .pipe(jasmineBrowser.specRunner({ console: true }))
    .pipe(jasmineBrowser.headless());
});

gulp.task('build', function () {
  return gulp.src('./src/gdrive-appdata.js')
    .pipe(webpackStream({
      output: { filename: 'gdrive-appdata.js' },
      plugins: [new UglifyJsPlugin({ minimize: true })]
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('default', ['test', 'build']);
