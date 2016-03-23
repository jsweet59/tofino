var manifest   = require('asset-builder')('./assets/manifest.json'),
    merge      = require('merge-stream'),
    fs         = require('fs'),
    gulpif     = require('gulp-if'),
    notify     = require('gulp-notify'),
    sourcemaps = require('gulp-sourcemaps'),
    uglify     = require('gulp-uglify'),
    util       = require('gulp-util'),
    browserify = require('browserify');,
    babelify   = require('babelify'),
    buffer     = require('vinyl-buffer'),
    source     = require('vinyl-source-stream');

// Compile JS
module.exports = function (gulp, production, browserSync) {
  'use strict';
  var paths = manifest.paths;
  gulp.task(
    'scripts',
    'Concat js files with sourcemaps. Also runs scripts:lint.',
    ['scripts:lint'],
    function() {
      var merged = merge();

      manifest.forEachDependency('js', function(dep) {
        dep.globs.forEach(function (path) {
          try {
            fs.accessSync(path);
          } catch (e) {
            util.log(util.colors.red('Warning! ' + path + ' does not exist.'));
          }
        });

        var bundler = browserify({
          entries: dep.globs,
          debug: false
        });

        bundler.transform(babelify);
        bundler.bundle()
          .on('error', function (err) { console.error(err); })
          .pipe(source(dep.name))
          .pipe(buffer())
          .pipe(sourcemaps.init({loadMaps: true}))
          .pipe(gulpif(production, uglify()))
          .pipe(sourcemaps.write('.', {sourceRoot: paths.scripts}))
          .pipe(gulp.dest(paths.dist + 'js'));
      });

    return merged
      .pipe(gulpif(!production, notify({
        "subtitle": "Task Complete",
        "message": "Scripts task complete",
        "onLast": true
      })))
      .on('finish', browserSync.reload);

    }, {
      options: {
        'production': 'Minified without sourcemaps.'
      }
    }
  );
};
