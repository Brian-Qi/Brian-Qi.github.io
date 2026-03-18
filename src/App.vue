<template>
  <div id="app">
    <ComingSoon />
  </div>
</template>

<script>
import ComingSoon from './components/ComingSoon.vue'

export default {
  name: 'App',
  components: {
    ComingSoon
  }
}
</script>

<style>
/* 全局样式可以放这里，比如body的背景色 */
body {
  margin: 0;
  background-color: #0a0c0f;
}
</style>