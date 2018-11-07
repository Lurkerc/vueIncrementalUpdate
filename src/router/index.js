import Vue from 'vue'
import Router from 'vue-router'

import one from './one'
import two from './two'

Vue.use(Router)

const routes = [
  {
    path: '/one',
    name: 'home',
    component: () => import(/* webpackChunkName: "helloWorld" */'$com/HelloWorld'),
    children: [
      one,
      two
    ]
  }
]

const mode = 'history'

export { routes, mode }

export default new Router({mode, routes})
