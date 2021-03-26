<template>
  <div id="app">
    <navi></navi>
    <router-view></router-view>
  </div>
</template>

<script>
import navi from './components/NavBar.vue'

export default {
  name: 'App',
  components: {
    navi
  }
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;

}
</style>
