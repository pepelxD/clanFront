'use strict';
const gulp = require('gulp');

const isDevelop = !process.env.NODE_ENV || process.env.NODE_ENV == 'develop';

module.exports = function (options) {
    return function () {
        return gulp.src(`${options.path.src.assets}/**/*.*`)
            .pipe(gulp.dest(`${options.path.build.dir}/assets`));
        /* .pipe(gulp.dest((file) => {
            file.history = [`assets/${file.basename}`];
            return `${options.path.build.dir}/assets`;
        }, {overwrite: false})); */
    };
};