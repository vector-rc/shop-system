<template>

  <main class="container">
     <router-link class="button is-link" to='/'>Productos </router-link>
  <router-link class="button is-link" to='/sale'> Ventas</router-link>
    <router-view/>
  </main>

</template>

<script setup lang="ts">
// import ViewProduct from './views/ViewProduct.vue'
import { useStore } from 'vuex'
import { onMounted } from 'vue'

const store = useStore()
onMounted(async () => {
  const res = await store.dispatch('fetchProducts')
  console.log(res)
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
