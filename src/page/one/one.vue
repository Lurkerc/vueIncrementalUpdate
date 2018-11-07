<!--
****--@file     one
****--@date     2018-08-28 13:58
****--@author   YC
****--@describe 测试1
-->
<template>
  <div class="one" id="one">
    这是测试1
    <el-row>
      <el-col>更新one</el-col>
    </el-row>
    <two></two>
    <router-link :to="{name:'home'}">返回</router-link>
  </div>
</template>
<script>
  /* 当前组件必要引入 */
  import two from '../two/two1'
  // 当前组件引入全局的util
  // let Util = null
  export default {
    name: 'one',
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
    components: {two}
  }

</script>
