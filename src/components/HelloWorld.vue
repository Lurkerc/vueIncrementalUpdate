<template>
  <div class="hello">
    <h2>Essential Links</h2>
    <router-link :to="{name:'One'}">one</router-link>
    <router-link :to="{name:'Two'}">two</router-link>
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'HelloWorld',
    data () {
      return {}
    }
  }
</script>

<style>
</style>
