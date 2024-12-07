'use strict';

// Include gulp.
const gulp = require('gulp');
const config = require('./config.json');

// Include plugins.
const sass = require('gulp-sass')(require('sass'));
const plumber = require('gulp-plumber');
const glob = require('gulp-sass-glob');
const babel = require('gulp-babel');
const uglify = require('gulp-uglify');
const notify = require('gulp-notify');
const sourcemaps = require('gulp-sourcemaps');
const stylelint = require('@ronilaukkarinen/gulp-stylelint');
const jshint = require('gulp-jshint');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const del = require('del');
const browserSync = require('browser-sync').create();

// Check if local config exists.
var fs = require('fs');
if (!fs.existsSync('./config-local.json')) {
  console.log('\x1b[33m', 'You need to rename default.config-local.json to' +
    ' config-local.json and update its content for watch task to succeed.', '\x1b[0m');
  if(process.argv[2] === 'watch') {
    process.exit();
  }
}
else {
  // Include local config.
  var configLocal = require('./config-local.json');
}

gulp.task('lint-scss', function fixCssTask() {
  return gulp.src(config.scss.src)

    .pipe(stylelint({
      reporters: [
        {formatter: 'string', console: true}
      ]
    }));
});

// Process CSS for production.
gulp.task('css', function () {
  var postcssPlugins = [
    autoprefixer('last 2 versions', '> 1%', 'ie 10')
  ];

  return gulp.src(config.css.src)
    .pipe(glob())
    .pipe(plumber({
      errorHandler: function (error) {
        notify.onError({
          title: "Gulp",
          subtitle: "Failure!",
          message: "Error: <%= error.message %>"
        })(error);
        this.emit('end');
      }
    }))
    .pipe(sass({
      outputStyle: 'compressed',
      errLogToConsole: true
    }))
    .pipe(postcss(postcssPlugins))
    .pipe(gulp.dest(config.css.dest))
});

// Process CSS for development.
gulp.task('css_dev', function () {
  var postcssPlugins = [
    autoprefixer('last 2 versions', '> 1%', 'ie 10')
  ];

  return gulp.src(config.css.src)
    .pipe(glob())
    .pipe(plumber({
      errorHandler: function (error) {
        notify.onError({
          title: "Gulp",
          subtitle: "Failure!",
          message: "Error: <%= error.message %>"
        })(error);
        this.emit('end');
      }
    }))
    .pipe(sourcemaps.init())
    .pipe(sass({
      outputStyle: 'expanded',
      errLogToConsole: true
    }))
    .pipe(postcss(postcssPlugins))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.css.dest))
    .pipe(browserSync.stream({match: '**/*.css'}));
});

// Process js for production.
gulp.task('scripts', function () {
  return gulp.src(config.js.src)
    .pipe(plumber({
      errorHandler: function (error) {
        notify.onError({
          title: 'Gulp scripts processing',
          subtitle: 'Failure!',
          message: 'Error: <%= error.message %>'
        })(error);
        this.emit('end');
      }
    }))
    .pipe(babel())
    .pipe(uglify())
    .pipe(gulp.dest(config.js.dest));
});

// Process js for bootstrap.
gulp.task('vendorJs', function () {
  return gulp.src(config.js.vendor)
    .pipe(plumber({
      errorHandler: function (error) {
        notify.onError({
          title: 'Gulp scripts processing',
          subtitle: 'Failure!',
          message: 'Error: <%= error.message %>'
        })(error);
        this.emit('end');
      }
    }))
    .pipe(uglify())
    .pipe(gulp.dest(config.js.dest));
});

// Process js for development.
gulp.task('scripts_dev', function () {
  return gulp.src(config.js.src)
    .pipe(plumber({
      errorHandler: function (error) {
        notify.onError({
          title: 'Gulp scripts processing',
          subtitle: 'Failure!',
          message: 'Error: <%= error.message %>'
        })(error);
        this.emit('end');
      }
    }))
    .pipe(sourcemaps.init())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.js.dest))
    .pipe(browserSync.stream({match: '**/*.js'}));
});

gulp.task('removeDist', function () {
  return del(['./dist/*']);
});

gulp.task('fontsDist', function () {
  return gulp.src(config.fonts.src, {encoding: false})
    .pipe(gulp.dest(config.fonts.dest));
});

gulp.task('imgDist', function () {
  return gulp.src(config.img.src, {encoding: false}).pipe(gulp.dest(config.img.dest));
});

// Watch task.
gulp.task('watch', function () {
  gulp.watch(config.css.src, {usePolling: true}, gulp.series('css_dev'));
  gulp.watch(config.js.src, {usePolling: true}, gulp.series('scripts_dev'));
});

// JS Linting.
gulp.task('js-lint', function () {
  return gulp.src(config.js.src)
    .pipe(jshint('.jshintrc'))
    .pipe(jshint.reporter('default'));
});

// BrowserSync settings.
gulp.task('browserSync', function () {
  browserSync.init({
    proxy: configLocal.browserSyncProxy,
    port: configLocal.browserSyncPort,
    open: false,
    injectChanges: true,
  });
});

// Compile for production.
gulp.task('build', gulp.series('removeDist', 'imgDist', 'css', 'lint-scss', 'scripts', 'vendorJs', 'fontsDist'));

// Compile for development with linter
gulp.task('dev', gulp.series('removeDist','fontsDist','imgDist', 'css_dev', 'lint-scss', 'scripts_dev', 'vendorJs'));

// Compile for development + BrowserSync + Watch
gulp.task('watch', gulp.series(gulp.series('removeDist', 'fontsDist', 'imgDist', 'css_dev', 'scripts_dev', 'vendorJs'), gulp.parallel('watch', 'browserSync')));

// Default Task
gulp.task('default', gulp.series('build'));
