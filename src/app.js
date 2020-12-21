// Vue Package
import vue from 'vue'
import router from './config/router'
import store from './store/store.js'
import i18n from './translate/translate.js'
import bootstrap_vue from 'bootstrap-vue'
import app from './app.vue'
import vueCookies from 'vue-cookies'

// Vue Config
// eslint-disable-next-line no-undef
// vue.config.performance = process.env.NODE_ENV !== 'production'
vue.config.devtools = true
vue.config.productionTip = false
vue.use(bootstrap_vue)

vue.use(vueCookies)
vue.$cookies.config('1d')

// Global CSS
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import './template/template.scss'

// Vue Instanse
new vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(app)
})