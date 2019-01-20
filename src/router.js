import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  mode: 'hash',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      meta: {
        // 这里可以带参数，可以在$route的对象中拿到
        index: 0
      },
      component: () => import('./views/home')
    }
  ]
})
