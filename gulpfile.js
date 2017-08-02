
var del = require('del');
var path = require('path');
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var fmModule = require('gulp-flynn-modulizer');

const paths = {
    src: path.join(__dirname, './src'),
    build: path.join(__dirname, './dist')
}

const sourcePath = path.join(paths.src, './jetpack.js');

gulp.task('clean', () => {
    return del(paths.build);
});

gulp.task('build-fm', ['clean'], ()=>{
   return fmModule.wrap({
       name: 'jetpack',
       constructorPath: sourcePath,
       outputPath: path.join(paths.build, './jetpack-fm.js')
   });
});

gulp.task('build', ['clean', 'build-fm'], () => {
    var source = gulp.src(sourcePath);

    // normal (non-minified)
    source
        .pipe(gulp.dest(paths.build))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(paths.build));
});