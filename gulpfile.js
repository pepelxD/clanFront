'use strict';
const gulp = require('gulp');
const config = require('./gulpConfig.json');

function requireTask(taskName, path, options) {
    options = options || {};
    options.taskName = taskName;
    gulp.task(taskName, function(callback) {
        let task = require(path).call(this, options);

        return task(callback);
    });
}
//const del = require('del');
//const watch = require('gulp-watch');
//const path = require('path');



const isDevelop = !process.env.NODE_ENV || process.env.NODE_ENV == 'develop';
// для windows:
// set NODE_ENV=prod - далее команды gulp, будет собираться продакшен версия.
//set NODE_ENV=develop - далее команды gulp, будет собираться develop версия.
// linux системы:
//NODE_ENV=prod {команда} - для сборки продакшена, иначе собирается develop версия


requireTask('css', config.path.tasks.css, config);

requireTask('js', config.path.tasks.js, config);

requireTask('html', config.path.tasks.html, config);

requireTask('img', config.path.tasks.img, config);

requireTask('font', config.path.tasks.font, config);

requireTask('json', config.path.tasks.json, config);

requireTask('assets', config.path.tasks.assets, config);

requireTask('clean', config.path.tasks.clean, config);

gulp.task('watch', () => {
    gulp.watch('dev/**/*.css', gulp.series('css'));
    gulp.watch('dev/**/*.js', gulp.series('js'));
    gulp.watch('dev/**/*.{jpg,jpeg,png,gif,svg}', gulp.series('img'));
    gulp.watch('dev/**/font/**/*.*', gulp.series('font'));
    gulp.watch('dev/**/*.json', gulp.series('json'));
    gulp.watch(`${config.path.src.assets}/**/*.*`, gulp.series('assets'));
    gulp.watch('dev/**/*.pug', gulp.series('html'));
});

var tasks = ['html', 'css', 'js', 'json', 'img', 'font', 'assets'] //['html', 'imgsprite', 'sass', 'img', 'font'];
//console.log(tasks)

gulp.task('default', gulp.series('clean', gulp.parallel(...tasks)));
gulp.task('prod', gulp.series('clean', gulp.parallel(...tasks)));
gulp.task('develop', gulp.parallel(...tasks, 'watch'));



//gulp.task('watch', function() {
  //  watch('dev/**/*.css', {readDelay: 500}, function(event, cb) {
    //    console.log(event.event + ' ' + event.path);
      //  gulp.start('css');
    //});
    //watch('dev/**/*.html', function(event, cb) {
    //    gulp.start('html');
    //});

    //watch('dev/**/*.js', function(event, cb) {
        
    //});

    //watch('dev/**/*.{jpg,png}', function(event, cb) {
    //    gulp.start('img');
    //}).on('unlink', function(file) {
    //    del('app/**/img/**/' + path.basename(file));
    //});
//});