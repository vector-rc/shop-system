<template>

<div class="modal is-active" v-if="showModal">
  <div class="modal-background"></div>
  <div class="modal-card">
    <header class="modal-card-head">
      <p class="modal-card-title">Modal title</p>
      <button class="delete" aria-label="close" @click="showModal=false"></button>
    </header>
    <section class="modal-card-body">
      ¿No ha escaneado el codigo esta seguro que quere guardar el producto?
    </section>
    <footer class="modal-card-foot">
      <button @click="saveProduct2()" class="button is-success">Guradar </button>
      <button @click="showModal=false" class="button">Cancelar</button>
    </footer>
  </div>
</div>
  <form @submit.prevent="saveProduct()" ref="form" class="box">
    <input
      autocomplete="off"
      @input="codeScan()"
      style="position:absolute;pointer-events: none;opacity:0"
      @click="($event.target as HTMLElement).blur()"
      @blur="existProductWithSameCode()"
      @focus="scaningCode=true"
      id="code_product"
      v-model="product.code"
    />

    <div class="field">
      <label class="label">Codigo {{ ':  ' + product.code }} </label>
      <div class="control">
        <span v-if="existProductWithCode" class="help is-danger">Ya existe un producto con este codigo</span>
        <button tabindex="-1" class="button is-success" :disabled="scaningCode" type="button" @click="focusCode()">{{scaningCode?'Esperando escaneo...':'Escanear codigo'}}</button>
      </div>
    </div>
    <div class="field">
      <label class="label" @click="selectName()">Nombre</label>
      <div class="control">
        <input class="input upper" @input="existProductWithSameName()" :class="{'is-danger':existProductWithName}" ref="fieldName" required v-model.trim="product.name" type="text" placeholder="Nombre" />
        <span v-if="existProductWithName"  class="help is-danger">Ya existe un producto con este nombre</span>
      </div>
    </div>
    <div class="field">
      <label class="label">Precio de Venta</label>
      <div class="control">
        <input class="input" required step="0.1" v-model.number="product.price" type="number" placeholder="Precio" />
      </div>
    </div>
    <div class="field">
      <label class="label">Cantidad</label>
      <div class="control">
        <input class="input" required v-model.number="product.stock" type="number" placeholder="cantidad" />
      </div>
    </div>
    <div class="field">
      <label class="label">Descripcion</label>
      <div class="control">
        <input class="input" type="text" placeholder="descripcion" />
      </div>
    </div>
    <button :disabled="existProductWithName||existProductWithCode" class="button is-primary">Guardar nuevo producto</button>
  </form>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const scaningCode = ref(false)
const fieldName = ref()
const existProductWithName = ref(false)
const existProductWithCode = ref(false)
const errorMsg = ref('')
const form = ref()

const showModal = ref(false)
const product = reactive({
  code: '',
  name: '',
  price: 0,
  stock: 0,
  description: ''
})

const resetProduct = () => {
  product.code = ''
  product.name = ''
  product.price = 0
  product.stock = 0
  product.description = ''
}
let codeField: HTMLInputElement

onMounted(() => {
  codeField = document.querySelector('#code_product') as HTMLInputElement
})

const codeScan = () => {
  const beforeCode = product.code
  setTimeout(() => {
    if (product.code === beforeCode) {
      codeField.blur()
      fieldName.value.focus()
    }
  }, 100)
}
const existProductWithSameCode = () => {
  existProductWithCode.value = store.state.products.some(({ code }:any) => (code.toString() === product.code))
  scaningCode.value = false
  errorMsg.value = 'Ya existe un producto con este codigo'
  return existProductWithCode.value
}

const existProductWithSameName = () => {
  existProductWithName.value = store.state.products.some(({ name }:any) => (name.toLowerCase() === product.name.toLowerCase()))
  return existProductWithName.value
}

const focusCode = () => {
  product.code = ''
  existProductWithCode.value = false
  codeField.focus()
}

const saveProduct2 = async () => {
  if (existProductWithName.value) return

  const res = await store.dispatch('saveProduct', { action: 'add', product })

  if (res.success) {
    resetProduct()
  }
  showModal.value = false
  console.log(res.message)
}
const selectName = () => {
  fieldName.value.select()
}

const saveProduct = async () => {
  if (existProductWithSameName()) return
  if (existProductWithSameCode()) return
  if (product.code === '') {
    showModal.value = true
    return
  }

  const res = await store.dispatch('saveProduct', { action: 'add', product })
  if (res.success) {
    resetProduct()
  }
  console.log(res.message)
}
</script>

<style></style>
