const gulp = require('gulp');
const rollup = require('gulp-better-rollup');
const babel = require('rollup-plugin-babel');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const uglify = require('rollup-plugin-uglify').uglify;
const sourcemaps = require('gulp-sourcemaps');
const gulpIf = require('gulp-if');

const isDevelop = !process.env.NODE_ENV || process.env.NODE_ENV == 'develop';

module.exports = function (options) {
    return  () => {
        return gulp.src([options.path.src.js])
        .pipe( gulpIf(isDevelop, sourcemaps.init()) )
        .pipe( rollup({
            plugins: [
                resolve({
                    jsnext: true,
                    main: true,
                    browser: true,
                    module: true
                  }),
                commonjs({include: 'node_modules/**'}),
                babel({
                    exclude: 'node_modules/**'
                }),
                (!isDevelop && uglify())
            ]
        }, 'iife') )
        .pipe( gulpIf(isDevelop, sourcemaps.write('.')) )
        .pipe( gulp.dest(options.path.build.jsDir) );
    };

};