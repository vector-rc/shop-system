<template>
  <form @submit.prevent="saveProduct()">
    <input
      required
      autocomplete="off"
      @input="codeScan()"
      style="position:absolute;pointer-events: none;opacity:0"
      @click="$event.target.blur()"
      @blur="verifyExistProduct()"
      @focus="scaningCode=true"
      id="code_product"
      v-model="product.code"
    />

    <div class="field">
      <label class="label">Codigo {{ ':  ' + product.code }} </label>
      <div class="control">
        <span v-if="existProduct" class="help is-danger">Ya existe un producto con este codigo</span>
        <button tabindex="-1" class="button is-success" :disabled="scaningCode" type="button" @click="focusCode()">{{scaningCode?'Escaneando codigo...':'Escanear codigo'}}</button>
      </div>
    </div>
    <div class="field">
      <label class="label">Nombre</label>
      <div class="control">
        <input class="input upper" ref="fieldName" required v-model="product.name" type="text" placeholder="Text input" />
      </div>
    </div>
    <div class="field">
      <label class="label">Precio</label>
      <div class="control">
        <input class="input" required step="0.1" v-model="product.price" type="number" placeholder="Text input" />
      </div>
    </div>
    <div class="field">
      <label class="label">Cantidad</label>
      <div class="control">
        <input class="input" required v-model="product.stock" type="number" placeholder="Text input" />
      </div>
    </div>
    <div class="field">
      <label class="label">Descripcion</label>
      <div class="control">
        <input class="input" type="text" placeholder="Text input" />
      </div>
    </div>
    <button class="button is-primary">Guardar nuevo producto</button>
  </form>
</template>

<script setup lang="ts">
import { onMounted, reactive, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const scaningCode = ref(false)
const fieldName = ref()
const existProduct = ref(false)

const product = reactive({
  code: '',
  name: '',
  price: '',
  stock: null
})
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
const verifyExistProduct = () => {
  existProduct.value = store.state.products.some(({ code }) => code.toString() === product.code)
  scaningCode.value = false
}

const focusCode = () => {
  product.code = ''
  existProduct.value = false
  codeField.focus()
}

const saveProduct = async () => {
  const res = await store.dispatch('saveProduct', { action: 'add', product })
  if (res.success) {
    store.state.products.push(res.data)
  }
  console.log(res.message)
}
</script>

<style></style>
