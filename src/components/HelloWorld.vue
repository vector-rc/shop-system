<template>
 <div>
   {{msg}}
 </div>
</template>

<script setup lang="ts">
import { onMounted } from '@vue/runtime-core'

defineProps({ msg: String })

onMounted(async () => {
  const req = await fetch(`${process.env.VUE_APP_URL_API}/test`)
  const res = await req.json()
  console.log(res.data)
})
</script>

<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
