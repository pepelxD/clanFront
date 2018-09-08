
const del = require('del');

module.exports = function (options) {
    return function () {
        return del([options.path.build.dir, 'tmp']).then(paths => {
            console.log('Рабочая директория очищена\n Удалены:\n', paths.join('\n'));
        });
    };
};