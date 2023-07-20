<script setup lang="ts">
defineProps<{ msg: string }>()

function triggerJSError () {
  console.log(kkk)
}
</script>

<template>
  <button @click="triggerJSError">触发js错误</button>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
