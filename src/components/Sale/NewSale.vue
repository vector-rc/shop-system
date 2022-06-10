<template>
  <modal-new-sale
    :show="showModal"
    @hide="showModal = false"
    :client="client"
    @save="saveSale($event)"
    :loading="loadingNewSale"
  />
  <manual-product
    :show="showModalManualProduct"
    @hide="showModalManualProduct = false"
    @addProduct="addProductToCart($event)"
  />

  <div class="responsive-container">
    <card-component title="Agrgar producto a la venta" class="add-sold-product">
      <input
        required
        autocomplete="off"
        @input="codeScan()"
        style="position: absolute; pointer-events: none; opacity: 0"
        @click="($event.target as HTMLElement).blur()"
        @blur="scanningCode = false"
        @focus="scanningCode = true"
        ref="fieldCode"
        v-model="productCode"
      />

      <div class="field">
        <label class="label">Codigo {{ ": " + productCode }}</label>
        <div class="control">
          <button
            tabindex="-1"
            class="button is-success"
            :disabled="scanningCode"
            type="button"
            @click="focusCode()"
          >{{ scanningCode ? "Escaneando codigos..." : "Escanear codigos" }}</button>
        </div>
      </div>

      <div class="field">
        <input
          type="button"
          class="button is-info"
          @click="showModalManualProduct = true"
          value="Agregar producto manualmente"
        />
      </div>
      <div class="field">
        <search-product @itemSelected="addProductToCart($event)" />
      </div>
    </card-component>

    <card-component title="Productos a vender" class="sold-products">
      <table class="table is-bordered is-striped is-fullwidth">
        <thead>
          <tr>
            <!-- <th>Id</th> -->
            <th class="code-sold-product">Codigo</th>
            <th>Nombre</th>
            <th>Precio</th>
            <th class="quantity-sold-product">Cant</th>
            <th class="mount-sold-product">Monto</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <sold-product
            v-for="item in itemsCart"
            :key="item.id"
            :product="item"
            @quit="quitProductToCart($event)"
          />
          <tr>
            <th colspan="20" style="text-align: center">TOTAL: S/. {{ totalMount }}</th>

          </tr>
        </tbody>
      </table>
      <div></div>
      <!-- <button @click="printer()" class="button is-primary">Imprimir</button> -->
      <button
        :disabled="itemsCart.length === 0"
        @click="validate()"
        class="button is-primary"
      >Realizar venta</button>

    </card-component>
    <div style="display: none">
      <iframe
        style="width: 550px; height: 900px; padding: 0"
        name="page-printer"
        :srcdoc="previewPrinter"
      ></iframe>
    </div>
  </div>
</template>

<script setup lang="ts">
import SearchProduct from '../SearchProduct.vue'
import SoldProduct from './SoldProduct.vue'
import ManualProduct from './ManualProduct.vue'
import { computed, ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import ModalNewSale from './ModalNewSale.vue'
import CardComponent from '../Shared/CardComponent.vue'
import { toast } from '@/utils/toast.js'

const store = useStore()

const productCode = ref('')
const fieldCode = ref()

const scanningCode = ref(false)
const itemsCart: any = ref([])
const textPrinter = ref('')
const showModal = ref(false)
const loadingNewSale = ref(false)
const showModalManualProduct = ref(false)

const client = reactive({
  documentType: 1,
  document: '0',
  name: '',
  email: '',
  address: {
    departamento: '-',
    provincia: '-',
    distrito: '-',
    direccion: '-',
    ubigeo: '-'
  }
})

const previewPrinter = computed(() => {
  return `
  <html>
  <head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300&display=swap" rel="stylesheet">
   <style>
  pre{
    font-family: 'Roboto Mono', monospace;
    font-weight: bold;
    padding:1rem;
    width:460px
    
  }
  </style></head>
  <body>
 
  <pre >
      ${ticket.value}
  </pre>
  </body>
  </html>
  `
})

const buildSpaces = (n: Number) => {
  if (n <= 0) return ''
  let spaces = ''
  for (let i = 0; i < n; i++) {
    spaces += ' '
  }
  return spaces
}

const ticket = computed(() => {
  return `
            INVERSIONES VILVER E.I.R.L
      Jr. Grau Nro. 1032 Cajamarca-Cajabamba   

    BOLETA DE VENTA ELECTRONICA 0000-0000000

Fecha de emision:2006-04-09
ID Venta: 0000546-5s654-sds645-sds65

DNI Cliente:${client.document}
Nombre Cliente:${client.name}
Direccion: ${client.address.direccion}
${textPrinter.value}
                 Subtotal:           S/${Math.round((totalMount.value * (100 / 118) + Number.EPSILON) * 10) / 10}
                 IGV(18%):           S/${Math.round((totalMount.value * (18 / 118) + Number.EPSILON) * 10) / 10}
                 Total:              S/${totalMount.value}
------------------------------------------------  `
})

const buildCorrelative = (correlative: number) => {
  let zeros = ''
  for (let i = 0; i < 8 - correlative.toString().length; i++) {
    zeros += '0'
  }
  return zeros + correlative.toString()
}
const reset = () => {
  client.documentType = 1
  client.document = '0'
  client.name = ''
  client.email = ''
  itemsCart.value = []
}

const renderBoucher = (legend: string, typeProof: string, sale: any, client: any, proof: any = []) => {
  let content = `
    INVERSIONES VILVER E.I.R.L - RUC 20605808931
      Jr. Grau Nro. 1032 Cajamarca-Cajabamba  `
  if (typeProof === 'ticket') {
    content += `
              TICKET DE VENTA ELECTRONICO 
      `
  } else {
    content += `
         ${typeProof.toLocaleUpperCase()} ELECTRONICA ${proof.serie}-${buildCorrelative(proof.correlative)}
      `
  }
  content += `
Fecha de emision:${typeProof !== 'ticket' ? proof.dateTime : sale.dateTime}
ID Venta: 00000${sale.id}
  `
  if (typeProof !== 'ticket') {
    content += `
CLIENTE:
Documento: ${client.document}
Nombre: ${client.name}
Direccion: ${!client.address ? '------------------' : client.address.direccion}
`
  }

  content += createTable(itemsCart.value)
  content += `
                OP.GRAVADAS:        S/ ${Math.round((sale.total * (100 / 118) + Number.EPSILON) * 10) / 10}
                   IGV(18%):        S/ ${Math.round((sale.total * (18 / 118) + Number.EPSILON) * 10) / 10}
                 DESCUENTOS:        S/ -0.00
              IMPORTE TOTAL:        S/ ${sale.total}
------------------------------------------------ 
${legend}

************************************************
            !GRACIAS POR SU COMPRA!
`

  return content
}

const createTable = (products: Array<any>) => {
  let firstline = ''
  let secondline = ''
  let textTable = '\n------------------------------------------------\n'
  textTable += 'PRODUCTO                 CANT P.UNI   MONTO\n'
  textTable += '------------------------------------------------\n'

  products.forEach((el: any) => {
    firstline = el.name.slice(0, 24) + buildSpaces(24 - el.name.length)
    firstline += '  '
    firstline += '' + el.quantity + buildSpaces(3 - ('' + el.quantity).length)
    firstline += ' S/'
    firstline += '' + el.priceSale + buildSpaces(6 - ('' + el.priceSale).length)
    firstline += ' S/'
    firstline += '' + el.mount + buildSpaces(7 - ('' + el.mount).length)
    textTable += `${firstline}\n`
    if (el.name.length > 24) {
      secondline = el.name.slice(24, 48)
      textTable += `${secondline}\n`
    }
    if (el.name.length > 48) {
      secondline =
        el.name.length > 72 ? el.name.slice(48, 72) + '...' : el.name.slice(48)
      textTable += `${secondline}\n`
    }
  })
  textTable += '------------------------------------------------\n'
  return textTable
}

const totalMount = computed(() => {
  return itemsCart.value.reduce((acumulate: Number, currentValue: any) => {
    return acumulate + currentValue.mount
  }, 0)
})

const findProductByCode = (codeProduct: string) => {
  const product = store.state.products.find(
    ({ code }: any) => code.toString() === productCode.value
  )
  return product
}

const addProductToCart = ({ id, code, name, priceSale, quantity }: any) => {
  const productSold: any = {
    id,
    code,
    name,
    priceSale,
    quantity: quantity ?? 1,
    mount: priceSale * 1
  }
  if (itemsCart.value.every((el: any) => el.id !== id)) {
    itemsCart.value.push(productSold)
  } else {
    const index = itemsCart.value.findIndex((el: any) => el.id === id)
    itemsCart.value[index].quantity += 1
    itemsCart.value[index].mount = productSold.priceSale * itemsCart.value[index].quantity
  }

  if (itemsCart.value.length === 0) {
    itemsCart.value.push(productSold)
  }
  // textPrinter.value = createTable(itemsCart.value)
  productCode.value = ''
}

const quitProductToCart = (id: number) => {
  const index = itemsCart.value.findIndex((el: any) => el.id === id)
  itemsCart.value.splice(index, 1)
}

onMounted(async () => {
  try {
    await store.dispatch('fetchProducts')
    const req = await fetch('http://localhost:5050/devices')
    await req.json()
  } catch (error) {
    toast.danger('No se encuentra el controlador de la impresora por favor inicie el controlador y configure la impresora')
  }
})

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
// const printer = async () => {
//   console.log(ticket.value)

//   if (itemsCart.value.length === 0) return

//   // const w = window.open(
//   //   '',
//   //   'Boleta de venta',
//   //   'location=yes,height=570,width=520,scrollbars=yes,status=yes,centerscreen'
//   // )
//   // w?.document.write('')
//   // w?.document.write(previewPrinter.value)
//   store.dispatch('printerTicket', { text: ticket.value })
//   // store.dispatch('testEncode', { text: textPrinter.value })
// }

const saveSale = async (typeProof: any) => {
  // @ts-check console.log({ soldProducts: itemsCart.value, client, typeProof })
  let r: string = ''
  let qrContent = ''
  loadingNewSale.value = true
  try {
    const saleData = await store.dispatch('saveSale', { soldProducts: itemsCart.value, client, typeProof })

    if (typeProof !== 'ticket') {
    // if (saleData.proof.status !== 'ACEPTADA') {
    //   msgValue.value = saleData.proof.description
    //   showMsg.value = true
    //   setTimeout(() => { showMsg.value = false }, 3000)
    // } else {
      const proof = saleData.proof.data
      r = renderBoucher(saleData.legend, typeProof, saleData.sale, saleData.client, proof)
      qrContent = `20605808931|${typeProof.value === 'boleta' ? '03' : '01'}|${proof.serie}|${buildCorrelative(proof.correlative)}|${Math.round((saleData.sale.total * (18 / 118) + Number.EPSILON) * 10) / 10}|${saleData.sale.total}|${proof.dateTime.slice(0, 10)}|0${saleData.client.documentType}|${saleData.client.document}`

    // }
    } else {
      r = renderBoucher(saleData.legend, typeProof, saleData.sale, saleData.client, [])
    }
    console.log(r)
    try {
      r = r.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')

      await store.dispatch('printerTicket', { text: r, qrContent })
      loadingNewSale.value = false
    } catch (error) {
      loadingNewSale.value = false
      toast.warning('La venta se ha registrado exitosamente, pero no se ha podido imprimir por que la impresora esta apagada o el controlador esta desactivado', 6000)
    }
  } catch (error) {
    toast.warning('Ocurrio un error al guardar la venta', 6000)
  } finally {
    loadingNewSale.value = false
    showModal.value = false
    reset()
  }
}

const focusCode = () => {
  productCode.value = ''
  fieldCode.value.focus()
}

const validate = () => {
  if (itemsCart.value.some((el: any) => el.priceSale === 0)) {
    toast.danger('Los precios no pueden ser cero', 3000)
    return
  }
  showModal.value = true
}

</script>

<style>
.code-sold-product,
.mount-sold-product {
  display: none;
}
.quantity-sold-product,
.name-sold-product,
.price-sold-product {
  padding: 0;
}
.quantity-sold-product,
.price-sold-product {
  width: 3rem;
}
.name-sold-product {
  width: 6rem;
}

/* .add-sold-product {
  width: 25rem;
} */
.sold-products{
  grid-column: span 2;
}

@media (min-width: 769px) {
  .code-sold-product,
  .mount-sold-product {
    display: table-cell;
  }
}
  /* grid-template-columns: repeat(auto-fit,minmax(30rem,1fr)); */
/* @media (min-width: 1280px) {
  .responsive-container {
    grid-template-columns: 25rem auto;
  }
} */

@media (min-width: 500px) {
  .quantity-sold-product {
    width: 6rem;
  }
  .name-sold-product,
  .price-sold-product {
    width: auto;
  }
}
</style>
