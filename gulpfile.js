const gulp = require('gulp');
const del = require('del');
const webpack = require('webpack-stream');
const uglify = require('gulp-uglify');
const less = require('gulp-less');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const cssnano = require('cssnano');
const fileinclude = require('gulp-file-include');
const htmlmin = require('gulp-htmlmin');
const jasmine = require('gulp-jasmine-browser');
const imagemin = require('gulp-imagemin');
const browserSync = require('browser-sync');
const config = require('./gulpcfg.json');

const distTaskFn = function () {
  return gulp.src(config.DIST_SRC)
    .pipe(gulp.dest(config.DIST_DEST));
};

/**
 * Cleanup
 * - delete `dist` folder contents
 * - delete `docs` folder contents
 * - skip .gitkeep
 */
gulp.task(config.CLEAN_TASK, function () {
  return del.sync(config.CLEAN_SRC);
});

/**
 * Scripts
 * - bundle
 * - minify
 * - copy
 */
gulp.task(config.JS_TASK, function () {
  return gulp.src(config.JS_SRC)
    .pipe(webpack(config.JS_BUNDLE_OPTIONS))
    .pipe(uglify())
    .pipe(gulp.dest(config.JS_DEST));
});

/**
 * Styles
 * - compile LESS
 * - auto-prefix
 * - minify
 * - copy
 * - stream
 */
gulp.task(config.CSS_TASK, function () {
  return gulp.src(config.CSS_SRC)
    .pipe(less())
    .pipe(postcss([
      autoprefixer(config.CSS_AUTOPREFIX_OPTIONS),
      cssnano()
    ]))
    .pipe(gulp.dest(config.CSS_DEST))
    .pipe(browserSync.stream());
});

/**
 * HTML
 * - compile
 * - minify
 * - copy
 */
gulp.task(config.HTML_TASK, function () {
  return gulp.src(config.HTML_SRC)
    .pipe(fileinclude(config.HTML_INCLUDE_OPTIONS))
    .pipe(htmlmin(config.HTML_MIN_OPTIONS))
    .pipe(gulp.dest(config.HTML_DEST));
});

/**
 * Images
 * - compress
 * - copy
 */
gulp.task(config.IMG_TASK, function () {
  return gulp.src(config.IMG_SRC)
    .pipe(imagemin())
    .pipe(gulp.dest(config.IMG_DEST));
});

/**
 * Distribution
 * - copy built files
 */
gulp.task(config.DIST_TASK, distTaskFn);

/**
 * Anything else
 */
gulp.task(config.MISC_TASK, function () {
  return gulp.src(config.MISC_SRC)
    .pipe(gulp.dest(config.MISC_DEST));
});

/**
 * Tests
 * - bundle
 * - run
 */
gulp.task(config.TEST_TASK, function () {
  return gulp.src(config.TEST_SRC)
    .pipe(webpack())
    .pipe(jasmine.specRunner(config.TEST_SPEC_OPTIONS))
    .pipe(jasmine.headless());
});

/**
 * Build
 * - clean
 * - scripts
 * - styles
 * - html
 */
gulp.task(config.BUILD_TASK, [
  config.CLEAN_TASK,
  config.JS_TASK,
  config.CSS_TASK,
  config.HTML_TASK,
  config.IMG_TASK,
  config.MISC_TASK
], distTaskFn);

/**
 * Dev mode
 * - build
 * - server
 * - watch
 */
gulp.task(config.DEV_TASK, [config.BUILD_TASK], function () {
  browserSync.init(config.DEV_OPTIONS);
  gulp.watch(config.CSS_ANY_SRC, [config.CSS_TASK]);
  gulp.watch(config.JS_ANY_SRC, [config.JS_TASK]).on('change', browserSync.reload);
  gulp.watch(config.HTML_ANY_SRC, [config.HTML_TASK]).on('change', browserSync.reload);
  gulp.watch(config.IMG_SRC, [config.IMG_TASK]).on('change', browserSync.reload);
  gulp.watch(config.MISC_SRC, [config.MISC_TASK]).on('change', browserSync.reload);
  gulp.watch(config.DIST_SRC, [config.DIST_TASK]);
});

/**
 * Default
 * - run tests
 * - build
 */
gulp.task('default', [
  config.TEST_TASK,
  config.BUILD_TASK
]);
