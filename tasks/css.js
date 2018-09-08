
const gulp = require('gulp');
const postcss = require('gulp-postcss');
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');

const isDevelop = !process.env.NODE_ENV || process.env.NODE_ENV == 'develop';

module.exports = function (options) {
    return  () => {
        return gulp.src([options.path.src.cssDir])
        .pipe( gulpIf(isDevelop, sourcemaps.init()) )
        .pipe( postcss() )
        .pipe( gulpIf(isDevelop, sourcemaps.write('.')) )
        .pipe( gulp.dest(options.path.build.cssDir) );
    };

};