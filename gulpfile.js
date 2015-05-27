    var gulp = require('gulp');
    var rename = require('gulp-rename');
    var uglify = require('gulp-uglify');
    var gulpImports = require('gulp-imports');

    var paths = {
        script: 'src/datepicker.js'
    };

    gulp.task('scripts', function () {
        return gulp.src(paths.script)
            .pipe(gulpImports())
            .pipe(rename('datepicker.min.js'))
            .pipe(uglify({
                properties: true,
                comparisons: true,
                preserveComments: 'some'
            }))
            .pipe(gulp.dest('./dest'));
    });


    gulp.task('watch', function () {
        gulp.watch(paths.scripts, ['scripts']);
    });


    gulp.task('default', ['scripts']);