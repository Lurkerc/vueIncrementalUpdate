<!--
****--@file     two1
****--@date     2018-09-05 18:05
****--@author   YC
****--@describe
-->
<template>
  <div>
    这是引用组件
  </div>
</template>
<script>
  /* 当前组件必要引入 */

  // 当前组件引入全局的util
  export default {
    name: '',
    data () {
      return {}
    },
    methods: {
      // 初始化请求列表数据
      init () {
      }

    },
    created () {
      this.init()
    },
    mounted () {
    },
    components: {}
  }

</script>
