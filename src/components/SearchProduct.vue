<template>
<div class="menu">

  <input class="input upper" type="search" @input="filterProducts()" v-model="querySearch">
  <ul class="menu-list">
      <li @click="emit('itemSelected',product)" v-for="product of productsFilter" :key="product.id">{{product.name}}</li>
  </ul>
</div>

</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'

const emit = defineEmits(['itemSelected'])

const store = useStore()
const products = ref([])
const productsFilter = ref([])
const querySearch = ref('')

onMounted(() => {
  products.value = store.state.products
})

const filterProducts = () => {
  const query = querySearch.value.toLowerCase()

  productsFilter.value = products.value.filter(({ name, code }) => name.toLowerCase().includes(query) || code.toString().toLowerCase().includes(query))
}

</script>

<style>

</style>
