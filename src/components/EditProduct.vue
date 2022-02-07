<template>
  <form @submit.prevent="saveProduct()">

    <div class="field">
      <label class="label">Codigo</label>
      <div class="control">
        {{product.code}}
      </div>
    </div>
    <div class="field">
      <label class="label">Nombre</label>
      <div class="control">
        <input class="input upper" v-model="product.name" type="text" placeholder="Text input" />
      </div>
    </div>
    <div class="field">
      <label class="label">Precio</label>
      <div class="control">
        <input class="input" step="0.1"  v-model="product.price" type="number" placeholder="Text input" />
      </div>
    </div>
    <div class="field">
      <label class="label">Cantidad</label>
      <div class="control">
        <input class="input" v-model="product.stock" type="number" placeholder="Text input" />
      </div>
    </div>
    <div class="field">
      <label class="label">Descripcion</label>
      <div class="control">
        <input class="input" type="text" placeholder="Text input" />
      </div>
    </div>
    <button class="button is-primary">Guardar cambios</button>
    <button type="button" @click="exit()" class="button is-danger">Cancelar</button>
  </form>
</template>

<script setup lang="ts">
import { computed, inject } from 'vue'
import { useStore } from 'vuex'

// const props = defineProps({
//   product: Object
// })
const store = useStore()

// const product = reactive(props.product)
const productToEdit = inject('productToEdit')
const toggleAddEdit = inject('toggleAddEdit')

const product = computed(() => {
  return productToEdit.value
})

const saveProduct = async () => {
  const res = await store.dispatch('saveProduct', { action: 'edit', product: product.value })
  toggleAddEdit.value = true

  console.log(res.message)
}
const exit = () => { toggleAddEdit.value = true }

</script>

<style></style>
