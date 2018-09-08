'use strict';

const gulp = require('gulp');
const pug = require('gulp-pug');

const isDevelop = !process.env.NODE_ENV || process.env.NODE_ENV == 'develop';

module.exports = function (options) {
    return function () {
        return gulp.src(options.path.src.html)
            .pipe(pug({}))
            .pipe(gulp.dest(options.path.build.dir))
    };
};