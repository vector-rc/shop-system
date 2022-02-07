<template>
  <input class="input" type="search" @input="filterProducts()" v-model="querySearch">
  <ul>
      <li v-for="product of productsFilter" :key="product.id">{{product.code}} : {{product.name}}
          <button @click="editProduct(product)">editar</button>
      </li>
  </ul>

</template>

<script setup lang="ts">
import { inject, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()
const products = ref([])
const productsFilter = ref([])
const querySearch = ref('')

onMounted(async () => {
  const res = await store.dispatch('fetchProducts')
  if (res.success) {
    products.value = store.state.products
    productsFilter.value = store.state.products
  }
})

const filterProducts = () => {
  const query = querySearch.value.toLowerCase()

  productsFilter.value = products.value.filter(({ name, code }) => name.toLowerCase().includes(query) || code.toString().toLowerCase().includes(query))
}
const productToEdit = inject('productToEdit')
const toggleAddEdit = inject('toggleAddEdit')

const editProduct = (product) => {
  productToEdit.value = product
  toggleAddEdit.value = false
}

</script>

<style>

</style>
