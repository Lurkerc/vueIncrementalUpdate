const router = {
  path: 'two',
  name: 'Two',
  component: () => import(/* webpackChunkName: "two" */'$page/two/two')
}

export default router
