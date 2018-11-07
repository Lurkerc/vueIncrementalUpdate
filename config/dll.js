module.exports = {
  entry: {
    vue: ['vue', 'vuex', 'vue-router'],
    ui: ['element-ui'],
    tool: ['lodash']
  },
  output: '../static/dll',
  productionGzip: true
}
