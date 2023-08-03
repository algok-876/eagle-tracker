<script setup lang="ts">
defineProps<{ msg: string }>()

function triggerJSError () {
  console.log(kkk)
}
async function triggerPromiseError () {
  const promise = new Promise((resolve, rej) => {
    setTimeout(() => {
      rej('promise rej test')
    }, 2000)
  })
  await promise
  console.log('成功了')
}

</script>

<template>
  <button @click="triggerJSError">触发js错误</button>
  <button @click="triggerPromiseError">触发promise错误</button>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
