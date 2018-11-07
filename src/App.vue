<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-link to="/one">go one</router-link>
    <router-view/>
  </div>
</template>
<script>
  export default {
    name: 'App'
  }
</script>

<style lang="less">
  @import 'assets/style/main';
</style>
