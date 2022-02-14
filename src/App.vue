<template>
  <main class="container" v-if="isLoadData">
    <router-link class="button is-link" to="/">Productos </router-link>
    <router-link class="button is-link" to="/sale"> Ventas</router-link>
    <router-link class="button is-link" to="/printers"> impresoras</router-link>
    <router-view />
  </main>
</template>

<script setup lang="ts">
import { useStore } from 'vuex'
import { onMounted, ref } from 'vue'

const store = useStore()
const isLoadData = ref(false)

onMounted(async () => {
  const res = await store.dispatch('fetchProducts')
  isLoadData.value = res.success
})
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
