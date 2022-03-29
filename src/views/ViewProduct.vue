<template>
  <div class="modal is-active" v-if="show">
    <div class="modal-background"></div>

    <div class="modal-card" style="width: 75%;height: 80%;">
      <write-product :product-id="idp" @cancel-edit="cancelEdit()" />
    </div>
  </div>
  <div>
    <list-products @edit-product="updateProduct($event)" />
  </div>
</template>

<script setup lang="ts">
import ListProducts from '../components/ListProducts.vue'
import { ref } from 'vue'
import WriteProduct from '../components/Product/WriteProduct.vue'

const idp = ref(-1)
const show = ref(false)
// provide('idProductToEdit', ref(0))
// const toggleAddEdit = ref(true)
// provide('toggleAddEdit', toggleAddEdit)

const updateProduct = (productId: number) => {
  console.log(productId)

  show.value = true
  idp.value = productId
  console.log(idp.value)
}
const cancelEdit = () => {
  show.value = false

  idp.value = -1
}

</script>

<style>
</style>
