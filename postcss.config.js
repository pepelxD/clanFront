const isDevelop = !process.env.NODE_ENV || process.env.NODE_ENV == 'develop';
let settings = {
    //syntax: require('postcss-scss'),
    plugins: {
      'postcss-import': {},
      //'postcss-cssnext': {},
      //'css-mqpacker': {sort: true},
      //'postcss-combine-duplicated-selectors': {},
      //'autoprefixer': {browsers: ['last 50 versions']},
      //'cssnano': {}
      //'postcss-mixins': {silent: true}, // выбрать нужно
      //'postcss-sassy-mixins': {silent: true}, // между ними
      //'postcss-calc': {}, // хз
      'postcss-neogrid': {},
    
      //'postcss-nested-ancestors': {}, // сомнительно что пригодиться, хотя в БЭМ именовании может быть полезен
      'postcss-nested': {}, // вложенные css правила 
      
      'postcss-nested-vars': {}, // переменные с областью видимости

      /* 'postcss-sprites': { // пока будем использовать webpack spritemith
        spritePath: 'images/',
        path: './dev/components/neoslide/img/spries/'

      }, */
      'postcss-sprites': {
        stylesheetPath: './app/css',
        spritePath: './app/img/',
        relativeTo: 'rule'
      },

      'css-mqpacker': {sort: true}, // объединяет медиа запросы
      //'postcss-mq-keyframes': {}, // извлекает @keyframes из медиа запроса
      'postcss-combine-duplicated-selectors': {}, // объединяет дублированные селекторы
     
    }
  }
  if (!isDevelop) {
    settings.plugins['cssnano'] = {};
  }
  module.exports = settings;
  