'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass');
sass.compiler = require('node-sass');

const ts = require('gulp-typescript');

gulp.task('copyData', function() {
    return gulp.src('./src/data/**')
        .pipe(gulp.dest('./app/data'));
})

gulp.task('sass', function () {
    return gulp.src('./src/scss/all.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(gulp.dest('./app/css'));
});

gulp.task('scripts', function () {
    return gulp.src('src/js/**/*.ts')
        .pipe(ts({
            noImplicitAny: true,
            module: "system",
            target: 'ES6',
            removeComments: true
        }))
        .pipe(gulp.dest('app/js'));
});

gulp.task('sass:watch', function () {
    gulp.watch('./src/scss/**/*.scss', gulp.series('sass'));
});