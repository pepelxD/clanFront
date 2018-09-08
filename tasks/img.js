'use strict';
const gulp = require('gulp');
const imagemin = require('gulp-imagemin');

const isDevelop = !process.env.NODE_ENV || process.env.NODE_ENV == 'develop';

module.exports = function (options) {
    return function () {
        return gulp.src([`${options.path.src.dir}/**/*.{jpg,jpeg,png,gif,svg}`, `!${options.path.src.dir}/**/sprite/*.{jpg,jpeg,png,gif,svg}`])
            .pipe(imagemin([
                imagemin.gifsicle({interlaced: true}),
                imagemin.jpegtran({progressive: true}),
                imagemin.optipng(),
                imagemin.svgo({plugins: [{removeViewBox: true}]})
            ]))
            .pipe(gulp.dest(/* `${options.path.build.imgDir}` */(file) => {
                file.history = [`img/${file.basename}`];
                return `${options.path.build.imgDir}`;
            }, {overwrite: false}));
    };
};