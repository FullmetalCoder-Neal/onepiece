import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// import dui from 'd-ui-vue2'
// import 'd-ui-vue2/lib/index/style.css'
// Vue.use(dui)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
