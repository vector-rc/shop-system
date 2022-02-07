<template>
<div class="columns">
  <div class="column">
    <add-product v-if="toggleAddEdit" />
    <edit-product v-if="!toggleAddEdit" />
  </div>
  <div class="column">
    <list-products />
  </div>
  </div>
</template>

<script setup lang="ts">
import EditProduct from '../components/EditProduct.vue'
import AddProduct from '../components/AddProduct.vue'
import ListProducts from '../components/ListProducts.vue'
import { provide, reactive, ref } from 'vue'

provide('productToEdit', reactive({}))
const toggleAddEdit = ref(true)
provide('toggleAddEdit', toggleAddEdit)
</script>

<style></style>
