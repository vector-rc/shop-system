<template>

  <form @submit.prevent="saveProduct()" class="box">

    <div class="field">
      <label class="label">Codigo</label>
      <div class="control">
        {{product.code}}
      </div>
    </div>
    <div class="field">
      <label class="label" @click="selectName()">Nombre</label>
      <div class="control">
        <input class="input upper" @input="existProductWithSameName()" v-model.trim="product.name" ref="fieldName" placeholder="Text input" />
         <span v-if="existProductWithName"  class="help is-danger">Ya existe un producto con este nombre</span>
      </div>
    </div>
    <div class="field">
      <label class="label">Precio</label>
      <div class="control">
        <input class="input" step="0.1"  v-model.number="product.price" type="number" placeholder="Text input" />
      </div>
    </div>
    <div class="field">
      <label class="label">Cantidad</label>
      <div class="control">
        <input class="input" v-model.number="product.stock" type="number" placeholder="Text input" />
      </div>
    </div>
    <div class="field">
      <label class="label">Descripcion</label>
      <div class="control">
        <input class="input" type="text" placeholder="Text input" />
      </div>
    </div>
    <button class="button is-primary" :disabled="existProductWithName">Guardar cambios</button>
    <button type="button" @click="abort()" class="button is-danger">Cancelar</button>
  </form>
</template>

<script setup lang="ts">
import { ref, inject, onMounted } from 'vue'
import { useStore } from 'vuex'

// const props = defineProps({
//   product: Object
// })
const store = useStore()

// const product = reactive(props.product)
const idProductToEdit:any = inject('idProductToEdit')

const toggleAddEdit:any = inject('toggleAddEdit')

const existProductWithName = ref(false)
const fieldName = ref()

const product = ref({} as any)

const existProductWithSameName = () => {
  existProductWithName.value = store.state.products.some(({ name, id }:any) => (name.toLowerCase() === product.value.name.toLowerCase() && id !== idProductToEdit.value))
  return existProductWithName.value
}

onMounted(() => {
  product.value = { ...store.state.products.find((el:any) => el.id === idProductToEdit.value) } as any
  console.log(product.value)
})
const saveProduct = async () => {
  if (existProductWithSameName()) return

  const res = await store.dispatch('saveProduct', { action: 'edit', product: product.value })
  toggleAddEdit.value = true

  console.log(res.message)
}
const abort = () => { toggleAddEdit.value = true }
const selectName = () => {
  fieldName.value.select()
}

</script>

<style></style>
