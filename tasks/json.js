'use strict';
const gulp = require('gulp');

const isDevelop = !process.env.NODE_ENV || process.env.NODE_ENV == 'develop';

module.exports = function (options) {
    return function () {
        return gulp.src(`${options.path.src.dir}/**/*.json`/* , {read: false} */)
        .pipe(gulp.dest((file) => {
            file.history = [`json/${file.basename}`];
            return `${options.path.build.dir}/json`;
        }, {overwrite: false}));
    };
};