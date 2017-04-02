const gulp = require('gulp');
const rename = require('gulp-rename');
const uglify = require('gulp-uglify');

const JS_DEST = './app/static/js';
const NODE = './node_modules';

gulp.task('default', function() {
  // Copy Angular to Static directory
  return gulp.src(NODE + '/angular/angular.min.js')
    .pipe(gulp.dest(JS_DEST));
});
