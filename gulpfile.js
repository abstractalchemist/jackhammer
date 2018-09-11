const gulp = require('gulp')
const mocha = require('gulp-mocha')

gulp.task('test', function() {
   return gulp.src(['test/**/*js']).pipe(mocha());
})


gulp.task('default', ['test'], function() {
   return gulp.watch(['test/**/*js','src/**/*js'], ['test']);
})
