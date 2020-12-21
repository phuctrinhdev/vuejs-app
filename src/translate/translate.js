import vue from 'vue'
import vue_i18n from 'vue-i18n'

// vue i18n
vue.use(vue_i18n)

const i18n = new vue_i18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages: {
    en: require('./en.json')
  }
})

export default i18n
