var gulp = require('gulp');
var minify = require('gulp-minify');

gulp.task('js', function () {
  gulp.src('gdrive-appdata.js')
    .pipe(minify())
    .pipe(gulp.dest('.'));
});

gulp.task('build', ['js']);
