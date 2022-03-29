<template>
  <div class="modal is-active" v-if="showModal">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Advertencia</p>
        <button class="delete" aria-label="close" @click="showModal = false"></button>
      </header>
      <section
        class="modal-card-body"
      >Algunos codigos estan vacios, ¿quiere guardar de todas formas?</section>
      <footer class="modal-card-foot">
        <button @click="saveProduct2()" class="button is-success">Guardar</button>
        <button @click="showModal = false" class="button">Cancelar</button>
      </footer>
    </div>
  </div>
  <card-component title="Agregar producto" :icon="AppsAddIn20Filled" >
  <form @submit.prevent="saveProduct()" ref="form">
  <FieldHorizontal label="Nombre">
<p class="control">
        <input
          class="input upper"
          @input="existProductWithSameName()"
          :class="{ 'is-danger': existProductWithName }"
          required
          v-model.trim="product.name"
        />
        <span
          v-if="existProductWithName"
          class="help is-danger"
        >Ya existe un producto con este nombre</span>
</p>
  </FieldHorizontal>
<hr/>

    <table class="table is-bordered is-fullwidth">
      <thead>
        <tr>
          <th>CODIGO</th>
          <th>PACKING</th>
          <th>PORCENTAJE DE GANANCIA</th>
          <!-- <th>MEDIDA</th> -->
          <th>PRECIO DE COMPRA</th>
          <th>PRECIO DE VENTA</th>
          <th>CANTIDAD</th>
          <th>
            <button type="button" class="button is-info" @click="addPackedProduct()">+</button>
          </th>
        </tr>
      </thead>
      <tbody>
        <PackedProduct
          v-for="(prod,index) in packedProducts"
          :key="prod.id"
          :product="prod"
          @quit="quitPackedProduct($event)"
          :ref=" (el:any) => { if (el) packsCompenents[index] = el }"
        />
      </tbody>
    </table>

    <button class="button is-primary" :disabled="hasErrors">Guardar producto</button>
    <button
      v-if="props.productId !== -1"
      type="button"
      @click="emit('cancelEdit')"
      class="button is-danger"
    >Cancelar</button>
      <span v-if="hasErrors" class="help is-danger">Hay codigos duplicados </span>

  </form>
  </card-component>

</template>

<script setup lang="ts">
import { reactive, ref, watchEffect, onMounted, provide } from 'vue'
import { useStore } from 'vuex'
import PackedProduct from './PackedProduct.vue'
import CardComponent from '../Shared/CardComponent.vue'
import FieldHorizontal from '../Shared/FieldHorizontal.vue'
import { AppsAddIn20Filled } from '@vicons/fluent'
import { toast } from '@/utils/toast'

const store = useStore()
const emit = defineEmits(['cancelEdit'])

const props = defineProps(
  {
    productId: {
      type: Number,
      default: -1
    }
  }
)
const existProductWithName = ref(false)
const form = ref()
const hasErrors = ref(false)

const defaulstPakings = [
  { pack: '12 UND', profitPercent: 25 },
  { pack: '25 UND', profitPercent: 25 },
  { pack: '50 UND', profitPercent: 25 },
  { pack: '100 UND', profitPercent: 25 }
]

const showModal = ref(false)
const product = reactive({
  id: -1,
  name: '',
  brand: '',
  tags: '',
  description: '',
  features: {} as any,
  image: ''

})

const packsCompenents = ref([] as any[])
const packedProducts = ref([] as any)

const buildNewPack = (packing:string, profitPercent:number, measureUnit:string, id = 'V' + Date.now()) => {
  return {
    id: id,
    productId: product.id,
    code: '',
    packing: packing,
    profitPercent: profitPercent,
    measureUnit: measureUnit,
    priceSale: 0,
    priceBuy: 0,
    stock: 0,
    error: 0
  }
}

const resetForm = () => {
  packedProducts.value = [buildNewPack('UND', 50, 'NIU')]
  defaulstPakings.forEach((el, index) => {
    packedProducts.value.push(buildNewPack(el.pack, el.profitPercent, 'BX', 'V' + Date.now() + index + 1))
  })

  product.name = ''
  product.brand = ''
  product.tags = ''
  product.features = {}
  product.description = ''
  product.image = ''
  emit('cancelEdit')
}

provide('packedProducts', packedProducts)

watchEffect(async () => {
  console.log(props.productId)
  product.id = props.productId
  if (props.productId !== -1) {
    const data = await store.dispatch('fetchPackProducts', { id: props.productId })

    packedProducts.value = data.data.packedProducts
    product.name = data.data.product.name
  } else {
    resetForm()
  }
})

onMounted(() => {

  // resetForm()
})

const validateDuplicateCodes = () => {
  const codes:[any] = packedProducts.value.map(({ code }:any) => code)
  const duplicateCodes = codes.filter((c, index) => codes.indexOf(c) !== index && c.toString() !== '')
  packedProducts.value.forEach((pp:any, index:number) => {
    if (pp.error === 1) return
    pp.error = 0
    duplicateCodes.forEach(dc => {
      if (pp.code === dc) packedProducts.value[index].error = 2
    })
  })
  hasErrors.value = packedProducts.value.some((pp:any) => pp.error !== 0)
}

watchEffect(() => {
  validateDuplicateCodes()
  console.log('duplicate yes', hasErrors.value)
})

const addPackedProduct = () => {
  packedProducts.value.push(buildNewPack('', 25, 'BX'))
}

const quitPackedProduct = (idProd:any) => {
  if (packedProducts.value.length === 1) return
  const index = packedProducts.value.findIndex((el:any) => el.id === idProd)
  packedProducts.value.splice(index, 1)
}

const existProductWithSameName = () => {
  if (props.productId !== -1) {
    existProductWithName.value = store.state.products.some(({ name, productId }: any) => (name.toLowerCase() === product.name.toLowerCase() && productId !== product.id))
  } else {
    existProductWithName.value = store.state.products.some(({ name }: any) => (name.toLowerCase() === product.name.toLowerCase()))
  }
  return existProductWithName.value
}

const saveProduct2 = async () => {
  if (existProductWithName.value) return
  showModal.value = false
  const data = { action: props.productId !== -1 ? 'edit' : 'add', data: { product, packedProducts: [...packedProducts.value] } }

  const res = await store.dispatch('savePackingProduct', data)

  if (res.success) {
    resetForm()
    toast.success('Producto guardado exitosamente', 2000)
  }
}
const saveProduct = async () => {
  const data = { action: props.productId !== -1 ? 'edit' : 'add', data: { product, packedProducts: [...packedProducts.value] } }

  if (existProductWithSameName()) return
  if (packedProducts.value.some((el :any) => el.code === '')) {
    showModal.value = true
    return
  }
  const res = await store.dispatch('savePackingProduct', data)
  if (res.success) {
    resetForm()
    toast.success('Producto guardado exitosamente', 2000)
  }
}
</script>

<style></style>
