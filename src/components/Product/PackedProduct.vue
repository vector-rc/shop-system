<template>
  <tr :class="{'has-background-danger-light':packedProduct.error!==0}" >
    <td class="control">
      <input
        autocomplete="off"
        @input="codeScan()"
        style="position:absolute;pointer-events: none;opacity:0"
        @click="($event.target as HTMLElement).blur()"
        @blur="existProductWithSameCode()"
        @focus="scaningCode = true"
        ref="codeField"
        v-model="packedProduct.code"
      />
      <span v-if="existProductWithCode" class="help is-danger">{{warningMsg}}</span>
      {{ packedProduct.code }}
      <input
        type="button"
        @click="focusCode()"
        :disabled="scaningCode"
        :value="scaningCode ? 'Esperando escaneo...' : 'Escanear codigo'"
        class="button is-info"
      />
    </td>

    <td class="control" >
      <input class="input is-upper" placeholder="10UND" v-model.trim="packedProduct.packing" />
    </td>
    <td class="control" >
      <input class="input is-upper" :class="{'is-danger':(packedProduct.profitPercent !== undefined && packedProduct.profitPercent < 0.1)}" @input="calculatePriceSale()" type="number" step="0.1" placeholder="porcentaje" v-model.number="packedProduct.profitPercent" />
    </td>

    <!-- <td class="control">
      <span class="select">
        <select>
          <option>UNIDAD</option>
          <option>CAJA</option>
          <option>METRO</option>
          <option>KG</option>
          <option>LATA</option>
        </select>
      </span>
    </td>-->

    <td class="control">
      <input
        class="input is-upper"
        type="number"
        step="0.01"
        placeholder="precio de compra"
        v-model.number="packedProduct.priceBuy"
        @input="calculatePriceSale()"
      />
    </td>
     <td class="control">
      <input
        class="input is-upper"
        type="number"
        step="0.01"
        placeholder="Precio de Venta"
        v-model="packedProduct.priceSale"
      />
    </td>
    <td class="control">
      <input
        class="input is-upper"
        type="number"
        placeholder="Cantidad"
        v-model="packedProduct.stock"
      />
    </td>
    <td class="control" >
      <button
        type="button"
        class="button is-danger"
        @click="emit('quit', (props.product as any).id)"
      >
        <icon size="20">
          <delete20-regular/>
        </icon>
      </button>
    </td>

  </tr>
</template>

<script setup lang="ts">
import { reactive, ref, onMounted } from 'vue'
import { useStore } from 'vuex'
import { Icon } from '@vicons/utils'
import { Delete20Regular } from '@vicons/fluent'

const store = useStore()

const emit = defineEmits(['quit', 'haveErrors'])
const props: any = defineProps({ product: Object })

const packedProduct = reactive(props.product)

const scaningCode = ref(false)
const existProductWithCode = ref(false)
const codeField = ref()
const warningMsg = ref('')

onMounted(() => {
  if (packedProduct.priceBuy !== 0 && packedProduct.priceSale !== 0) {
    packedProduct.profitPercent = Math.round((packedProduct.priceSale - packedProduct.priceBuy) / packedProduct.priceBuy * 100)
  }
})

const calculatePriceSale = () => {
  packedProduct.packing = packedProduct.packing.toLocaleUpperCase()
  if (packedProduct.priceBuy === 0) return
  if (packedProduct.profitPercent === 0) return
  const percent = packedProduct.profitPercent / 100
  if (percent !== 0) {
    const brutePriceSale = packedProduct.priceBuy + (packedProduct.priceBuy * percent)
    packedProduct.priceSale = Math.round((brutePriceSale + Number.EPSILON) * 10) / 10
  }
}

const codeScan = () => {
  const beforeCode = packedProduct.code
  setTimeout(() => {
    if (packedProduct.code === beforeCode) {
      codeField.value.blur()
    }
  }, 100)
}
const existProductWithSameCode = () => {
  if (packedProduct.productId !== -1) {
    existProductWithCode.value = store.state.products.some(({ code, productId }: any) => (code.toString() === packedProduct.code && productId !== packedProduct.productId))
    warningMsg.value = 'Ya existe un producto con este codigo'
  } else {
    existProductWithCode.value = store.state.products.some(({ code }: any) => (code.toString() === packedProduct.code))
    warningMsg.value = 'Ya existe un producto con este codigo'
  }
  packedProduct.error = existProductWithCode.value ? 1 : 0
  scaningCode.value = false
  return existProductWithCode.value
}

// const isEdit = packedProduct.productId !== undefined

const focusCode = () => {
  packedProduct.error = 0
  packedProduct.code = ''
  existProductWithCode.value = false
  codeField.value.focus()
}

</script>

<style></style>
