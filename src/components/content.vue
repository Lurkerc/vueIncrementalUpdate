<!--
****--@file     content
****--@date     2018-09-07 16:32
****--@author   YC
****--@describe 内容视图
-->
<template>
  <div>
    <router-view></router-view>
  </div>
</template>
<script>
  /* 当前组件必要引入 */

  // 当前组件引入全局的util
  export default {
    name: 'content',
    props: [],
    data () {
      return {};
    },
    methods: {
      // 初始化请求列表数据
      init () {
        Util = this.$util;
      }

    },
    created () {
      this.init();
    },
    mounted () {
    },
    components: {}
  };

</script>
