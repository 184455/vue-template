import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import FastClick from 'fastclick'
import VConsole from 'vconsole'
import './common/stylus/index.styl'

Vue.config.productionTip = false
FastClick.attach(document.body) /* eslint-disable */

if (window.location.hostname !== 'localhost') {
  new VConsole() /* eslint-disable */
}

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

