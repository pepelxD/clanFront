'use strict';
const gulp = require('gulp');

const isDevelop = !process.env.NODE_ENV || process.env.NODE_ENV == 'develop';

module.exports = function (options) {
    return function () {
        return gulp.src(`${options.path.src.dir}/**/*.{ttf,otf,woff2,woff}`, {read: false})
        .pipe(gulp.dest((file) => {
            file.history = [`font/${file.basename}`];
            return `${options.path.build.dir}`;
        }, {overwrite: false}));
    };
};