'use strict';

var gulp        = require('gulp'),
    concat      = require('gulp-concat'),
    uglify      = require('gulp-uglify'),
    sass        = require('gulp-sass'),
    maps        = require('gulp-sourcemaps'),
    htmlmin     = require('gulp-htmlmin'),
    connect     = require('gulp-connect'),
    pages       = require('gulp-gh-pages'),
    del         = require('del');

var SOURCE_DIR  = './src',
    BUILD_DIR   = './dist',
    BOWER_DIR   = './bower_components';

gulp.task('_build-libjs', function () {
    return gulp.src([
            BOWER_DIR + '/jquery/dist/jquery.min.js',
            BOWER_DIR + '/bootstrap/dist/js/bootstrap.min.js',
            BOWER_DIR + '/angular/angular.min.js'])
        .pipe(maps.init({ loadMaps: true }))
            .pipe(concat('lib.min.js'))
        .pipe(maps.write('./'))
        .pipe(gulp.dest(BUILD_DIR + '/js'));
});

gulp.task('_build-libcss', function () {
    return gulp.src([
            BOWER_DIR + '/bootstrap/dist/css/bootstrap.min.css',
            BOWER_DIR + '/bootstrap/dist/css/bootstrap-theme.min.css'])
        .pipe(maps.init({ loadMaps: true }))
            .pipe(concat('lib.min.css'))
        .pipe(maps.write('./'))
        .pipe(gulp.dest(BUILD_DIR + '/css'));
});

gulp.task('_build-js', function () {
    return gulp.src(SOURCE_DIR + '/js/**/*.js')
        .pipe(maps.init())
            .pipe(uglify())
            .pipe(concat('app.min.js'))
        .pipe(maps.write('./'))
        .pipe(gulp.dest(BUILD_DIR + '/js'));
});

gulp.task('_build-css', function () {
    return gulp.src(SOURCE_DIR + '/scss/app.scss')
        .pipe(maps.init())
            .pipe(sass({ outputStyle: 'compressed' }))
            .pipe(concat('app.min.css'))
        .pipe(maps.write('./'))
        .pipe(gulp.dest(BUILD_DIR + '/css'));
});

gulp.task('_build-html', function () {
    del([BUILD_DIR + '/**/*.html']);

    return gulp.src(SOURCE_DIR + '/**/*.html')
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest(BUILD_DIR));
});

gulp.task('_reload', function () {
    return gulp.src(BUILD_DIR + '/index.html')
        .pipe(connect.reload());
});

gulp.task('build', ['_build-libcss', '_build-libjs', '_build-css', '_build-js', '_build-html']);

gulp.task('clean', function () {
    return del([BUILD_DIR]);
});

gulp.task('serve', ['build'], function () {
    connect.server({
        root: BUILD_DIR,
        livereload: true
    });

    gulp.watch([SOURCE_DIR + '/**/*.js'], ['_build-js']);
    gulp.watch([SOURCE_DIR + '/**/*.scss'], ['_build-css']);
    gulp.watch([SOURCE_DIR + '/**/*.html'], ['_build-html']);
    gulp.watch([BUILD_DIR + '/**/*', '!**/*.map'], ['_reload']);
});

gulp.task('deploy', ['build'], function () {
    return gulp.src(BUILD_DIR + '/**/*')
        .pipe(pages());
});

gulp.task('default', ['serve']);
