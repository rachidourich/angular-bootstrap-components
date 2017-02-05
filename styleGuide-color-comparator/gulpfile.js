 
var gulp        = require('gulp');
var browserSync = require('browser-sync').create();
var less        = require('gulp-less');
var appLoc = "./app/" ;
var lessFilesSrc = appLoc + "less/*.less"; 
var cssFilesDist =  appLoc + "css/" ;
// Static Server + watching scss/html files
gulp.task('severWithLessCompile', ['less'], function() {

    browserSync.init({
      server: {
        baseDir: appLoc,
        directory: false,
        index: "index.html",
        routes: {
          "/bower_components": "bower_components"
         }
      }
        
    });

    gulp.watch(lessFilesSrc, ['less']);
    gulp.watch(appLoc + "*.html").on('change', browserSync.reload);
});

// Compile less into CSS & auto-inject into browsers
gulp.task('less', function() {
    return gulp.src(lessFilesSrc)
        .pipe(less())
        .on('error', swallowError)
        .pipe(gulp.dest(cssFilesDist))
        .pipe(browserSync.stream());
});

gulp.task('default', ['severWithLessCompile']);

function swallowError (error) {

  // If you want details of the error in the console
  console.log(error.toString());

  this.emit('end');
}