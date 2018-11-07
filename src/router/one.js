const router = {
  path: 'one',
  name: 'One',
  component: () => import(/* webpackChunkName: "one" */'$page/one/one')
}

export default router
