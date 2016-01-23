var gulp = require('gulp');
var rename = require('gulp-rename');
var source = require('vinyl-source-stream');
var del = require('del');
var exorcist = require('exorcist');
var browserify = require('browserify');
var tsify = require('tsify');
var uglifyJs = require('gulp-uglify');


gulp.task('clean', function() {
    return del(['build/*']); // if I remove the whole folder, exorcist fails silently.
});

gulp.task('compile', ['clean'], function() {
    return browserify({
            debug: true
        })
        .add('src/main.ts')
        .add('typings/tsd.d.ts')
        .plugin(tsify)
        .bundle()
        .on('error', function (error) { console.error(error.toString()); })
        .pipe(exorcist('build/d3bind.js.map'))
        .pipe(source('d3bind.js'))
        .pipe(gulp.dest('build'));
});

gulp.task('uglify', ['compile'], function() {
    return gulp.src('build/d3bind.js')
        .pipe(uglifyJs())
        .pipe(rename('d3bind.min.js'))
        .pipe(gulp.dest('build'));
});

gulp.task('watch', function() {
    gulp.watch('src/**/*.ts', ['compile']);
});

gulp.task('build', ['uglify']);
gulp.task('default', ['build']);
