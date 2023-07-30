<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue'
import {useRouter} from 'vue-router'
const router = useRouter()

function to () {
  router.replace('/page3')
}
</script>

<template>
  <div>
    <a href="https://vitejs.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
  <RouterLink to="/">首页</RouterLink>
  <RouterLink to="/page1">page1</RouterLink>
  <RouterLink to="/page2">page2</RouterLink>
  <RouterLink to="/page3">page3</RouterLink>
  <RouterLink to="/page4">page4</RouterLink>
  <button @click="to">page3(replace)</button>
  <div class="wrapper">
    <router-view></router-view>

  </div>
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
.wrapper {
  border: 2px solid green;
  padding: 20px;
}
</style>
