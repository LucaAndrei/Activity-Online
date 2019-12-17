var gulp = require('gulp');
var sass = require('gulp-sass');
var src = 'src/scss/**/*.scss';
gulp.task('default', function() {
    return gulp.src(src).pipe(sass()).pipe(gulp.dest('src/dist/css'))
});


gulp.task('sass:watch',
    function() {
        return gulp.watch(src, gulp.series('default'));
});

exports.w = gulp.series('default', 'sass:watch')