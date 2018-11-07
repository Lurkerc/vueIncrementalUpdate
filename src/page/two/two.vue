<!--
****--@file     two
****--@date     2018-08-28 14:00
****--@author   YC
****--@describe 测试2
-->
<template>
  <div class="two">
    测试2
    <router-link :to="{name:'home'}">返回</router-link>
    <two1></two1>
  </div>
</template>
<script>
  /* 当前组件必要引入 */
  import two1 from './two1'
  // 当前组件引入全局的util
  // let Util = null
  export default {
    name: 'two',
    data () {
      return {}
    },
    methods: {
      // 初始化请求列表数据
      init () {
        // Util = this.$util
      }

    },
    created () {
      this.init()
    },
    mounted () {
    },
    components: {two1}
  }

</script>
