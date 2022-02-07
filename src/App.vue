<template>
  <main class="container">
    <!-- <view-product /> -->
    <view-sale />

  </main>
</template>

<script setup lang="ts">
// import ViewProduct from './views/ViewProduct.vue'
import { useStore } from 'vuex'
import ViewSale from './views/ViewSale.vue'
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
