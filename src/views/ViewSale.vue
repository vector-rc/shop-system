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
    <table class="table is-bordered is-striped">
      <thead>
        <tr>
          <!-- <th>Id</th> -->
          <th>Codigo</th>
          <th>Nombre</th>
          <th>Precio</th>
          <th>Cantidad</th>
          <th>Monto</th>
          <th>Opciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item of itemsCart" :key="item.id">
          <!-- <th>{{item.id}}</th> -->
          <td>{{item.code}}</td>
          <td>{{item.name}}</td>
          <td>S/. {{item.price}}</td>
          <td>{{item.quantity}}</td>
          <td>S/. {{item.mount}}</td>
          <td><button class="button is-danger"><i class="bi bi-trash"></i></button></td>
        </tr>
      </tbody>
    </table>
    <div>Total: S/. {{totalMount}}</div>
    <button @click="printer()" class="button is-primary">Realizar venta</button>
  </div>
  <div>
    <iframe style="width:72mm;height:500px;border:solid #000 1px,;padding:0" name="page-printer" :srcdoc="textPrinter" ></iframe>
  </div>

  </div>
</template>

<script setup lang="ts">
import SearchProduct from '../components/SearchProduct.vue'
import { computed, onMounted, ref } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const productCode = ref('')
const fieldCode = ref()
const scanningCode = ref(false)
const itemsCart = ref([])
const textPrinter = ref('')

onMounted(() => {
  textPrinter.value = `
  <html>
  <head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300&display=swap" rel="stylesheet">
   <style>
  pre{
    font-family: 'Roboto Mono', monospace;
    font-weight: bold;
  }
  </style></head>
  <body>
 
  <pre >
        Supermarket Ticket
Ginger A Store #12345REG #02
Date:2006-04-09           Time:18:30
------------------------------------
Item                    Qty    Amount
gaseosasddas dsdas      1.2    $1.00
Sheepasdasdsdas         2.0    $5.00
Brush adsd  sadasd      1.6    $3.8
Beerasda  asdasdasdasd  2      $8.00
------------------------------------
Subtotal:
Tax:
Total:             $17.80
------------------------------------
   Customer signature
        Thank you
 Please come again soon
  </pre>
  </body>
  </html>
  `
})

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
      if (product) {
        addProductToCart(product)
      }
      productCode.value = ''
    }
  }, 100)
}
const printer = () => {
  window.frames['page-printer'].focus()
  window.frames['page-printer'].print()
}

const focusCode = () => {
  productCode.value = ''

  fieldCode.value.focus()
}

</script>

<style></style>
