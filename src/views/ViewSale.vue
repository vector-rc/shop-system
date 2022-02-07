<template>
<div class="columns">
  <div class="column is-3">
     <input
      required
      autocomplete="off"
      @input="codeScan()"
      style="position:absolute;pointer-events: none;opacity:0"
      @click="$event.target.blur()"
      @blur="scanningCode=false"
      @focus="scanningCode=true"
      ref="fieldCode"
      v-model="productCode"
    />

    <div class="field">
      <label class="label">Codigo {{ ':  ' + productCode }} </label>
      <div class="control">
        <span class="help is-danger">Ya existe un producto con este codigo</span>
        <button tabindex="-1" class="button is-success" :disabled="scanningCode" type="button" @click="focusCode()">{{scanningCode?'Escaneando codigos...':'Escanear codigos'}}</button>
      </div>
    </div>
    <div class="field">
      <search-product @itemSelected="addProductToCart($event)"/>
    </div>
  </div>
  <div class="column">
    <table class="table">
      <thead>
        <tr>
          <th>Id</th>
          <th>Codigo</th>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Cantidad</th>
          <th>Monto</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of itemsCart" :key="item.id">
          <th>{{item.id}}</th>
          <td>{{item.code}}</td>
          <td>{{item.name}}</td>
          <td>{{item.price}}</td>
          <td>{{item.quantity}}</td>
          <td>{{item.mount}}</td>
        </tr>
      </tbody>
    </table>
    <span>Total: {{totalMount}}</span>
  </div>

  </div>
</template>

<script setup lang="ts">
import SearchProduct from '../components/SearchProduct.vue'
import { computed, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const productCode = ref('')
const fieldCode = ref()
const scanningCode = ref(false)
const itemsCart = ref([])

const totalMount = computed(() => {
  return itemsCart.value.reduce((acumulate, currentValue) => {
    return acumulate + currentValue.mount
  }, 0)
})

const findProductByCode = (codeProduct) => {
  const product = store.state.products.find(({ code }) => code.toString() === productCode.value)
  return product
}
const addProductToCart = ({ id, code, name, price }) => {
  const productSold = { id, code, name, price, quantity: 1, mount: price * 1 }
  if (itemsCart.value.length === 0) {
    itemsCart.value.push(productSold)
  }
  if (itemsCart.value.every(el => el.id !== id)) {
    itemsCart.value.push(productSold)
  } else {
    const index = itemsCart.value.findIndex((el) => el.id === id)
    itemsCart.value[index].quantity += 1
    itemsCart.value[index].mount += productSold.price
  }
  productCode.value = ''
}

const codeScan = () => {
  const beforeCode = productCode.value
  setTimeout(() => {
    if (productCode.value === beforeCode) {
      const product = findProductByCode(productCode.value)
      addProductToCart(product)
      productCode.value = ''
    }
  }, 100)
}

const focusCode = () => {
  productCode.value = ''

  fieldCode.value.focus()
}

</script>

<style></style>
