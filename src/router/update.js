import Vue from 'vue'
import Router from 'vue-router'

import '../assets/style/main.less'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [require('./one')]
})
