
var del = require('del');
var path = require('path');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');

const paths = {
    src: path.join(__dirname, './src'),
    build: path.join(__dirname, './dest')
}

gulp.task('clean', () => {
    return del(paths.build);
});

gulp.task('build', ['clean'], () => {
    var source = gulp.src('./src/jetpack.js');

    // normal (non-minified)
    source
        .pipe(gulp.dest(paths.build));

    // normal minified
    source
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.build));
});