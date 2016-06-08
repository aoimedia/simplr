// ----------- Dependencies

var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync');
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var minifyCSS = require('gulp-clean-css');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
var runSequence = require('run-sequence');

// ----------- Variables

var stylesInput  = 'app/scss/**/*.scss';
var scriptsInput = 'app/js/**/*.js';
var markupInput  = 'app/*.html';

// ----------- Server

gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: 'app'
    },
  })
});

// ----------- Minify images

// gulp.task('images', function(){
//   return gulp.src('app/img/**/*.+(png|jpg|gif|svg)')
//   .pipe(imagemin())
//   .pipe(gulp.dest('dist/img'))
// });

// ----------- Compile SASS & Reload

gulp.task('sass', function() {
  return gulp.src(stylesInput)
    .pipe(sass())
    .pipe(gulp.dest('app/css'))
    .pipe(browserSync.reload({
      stream: true
    }))
});

// ----------- Watch: browserSync, sass & watch for file changes

gulp.task('default', ['browserSync', 'sass'], function (){
  gulp.watch(stylesInput, ['sass']); 
  gulp.watch(scriptsInput, browserSync.reload); 
  gulp.watch(markupInput, browserSync.reload); 
});

// ----------- Minify CSS and JS, then put everything in /dist

gulp.task('useref', function(){
  var assets = useref.assets();

  return gulp.src('app/*.html')
    .pipe(assets)
    // Minifies only if it's a CSS file
    .pipe(gulpIf('*.css', minifyCSS()))
    // Uglifies only if it's a Javascript file
    .pipe(gulpIf('*.js', uglify()))
    .pipe(assets.restore())
    .pipe(useref())
    .pipe(gulp.dest('dist'))
});

// ----------- Cleanup

gulp.task('clean', function(callback) {
  del('dist');
  return cache.clearAll(callback);
})

// ----------- Build

gulp.task('build', function(callback) {
  runSequence('clean', 'sass', 'useref', callback);
});


