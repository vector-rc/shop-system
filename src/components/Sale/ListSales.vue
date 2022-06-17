<template>
  <ModalSaleDetail :saleId="saleIdDetails" :show="showModal" @hide="showModal = false" />
  <div class="columns">
    <div class="column is-11">
      <div class="control has-icons-left">
        <input
          class="input"
          type="search"
          @input="filterSales()"
          v-model.trim="querySearch"
          placeholder="Buscar por nombre o documento"
        />

        <Icon class="icon is-large is-left">
          <search20-regular />
        </Icon>
      </div>
      <div class="control">
        <RadioButton label="Todos" value="0" v-model.number="typeProofDisplay"/>
        <RadioButton label="Facturas" value="1" v-model.number="typeProofDisplay"/>
        <RadioButton label="Boletas" value="3" v-model.number="typeProofDisplay"/>
        <RadioButton label="Sin Comprobate" value="99" v-model.number="typeProofDisplay"/>
      </div>
    </div>

    <div class="column is-1">
      <button class="button is-primary" @click="syncsales()">
        <Icon class="icon is-large is-left">
          <arrow-sync20-filled />
        </Icon>
      </button>
    </div>
  </div>
  <div class="h-100 oy-scroll">
    <table class="table is-narrow is-hoverable is-bordered is-striped is-fullwidth">
      <thead>
        <tr style="position:sticky;">
          <th>ID</th>
          <th>Cliente</th>
          <th>Documento Cliente</th>
          <th>Fecha de venta</th>
          <th>Importe Total</th>
          <th>Tipo de comprobante</th>
          <th></th>
        </tr>
      </thead>
      <tbody style="padding-top: 2px;">
        <tr
          v-for="sale of salesFilter"
          :key="sale.id"
          :class="{ 'has-background-danger-light': sale.enable === 0 || sale.status===3 || sale.status===5}"
        >
          <td>{{ sale.id }}</td>
          <td>{{ sale.clientName }}</td>
          <td>{{ sale.clientDocument }}</td>
          <td>{{ sale.dateTime }}</td>
          <td>{{getCurrencySymbolByIso(sale.currency)}} {{ sale.total }}</td>
          <td>
            <span class="tag is-primary">{{ getProofType(sale.proofType) }}</span>
            <span v-if=" sale.enable === 0 || sale.status===3 || sale.status===5" class="tag is-danger">ANULADO</span>
          </td>
          <td>
            <button
              class="button is-info is-small"
              @click="saleIdDetails = sale.id, showModal = true"
            >
              <Icon>
                <edit20-regular />
              </Icon>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { Edit20Regular, Search20Regular, ArrowSync20Filled /*, Copy20Regular */ } from '@vicons/fluent'
import { Icon } from '@vicons/utils'
import ModalSaleDetail from './ModalSaleDetail.vue'
import RadioButton from '../Shared/RadioButton.vue'
import { toast } from '@/utils/toast'
import { getCurrencySymbolByIso } from '@/utils/currencies'

const store = useStore()
const sales = ref([] as any[])
const salesFilter = ref([] as any[])
const querySearch = ref('')
const showModal = ref(false)
const saleIdDetails = ref(0)
const typeProofDisplay = ref(0)

onMounted(async () => {
  const res = await store.dispatch('fetchSales')
  if (!res.success) {
    toast.danger(res.message)
    return
  }
  sales.value = res.data.reverse()
  salesFilter.value = sales.value
})

watchEffect(() => {
  console.log(typeProofDisplay.value)
  querySearch.value = ''
  if (parseInt(typeProofDisplay.value as any) === 0) {
    salesFilter.value = sales.value
    return
  }

  salesFilter.value = sales.value.filter(s => s.proofType === parseInt(typeProofDisplay.value as any))
})

const getProofType = (proofType: any) => {
  return proofType === 99 ? 'SIN COMPROBANTE' : (proofType === 3 ? 'BOLETA' : 'FACTURA')
}

const filterSales = () => {
  const query = querySearch.value.toLowerCase()

  salesFilter.value = sales.value.filter(el => {
    return (el.clientName.toLowerCase().includes(query) ||
      el.clientDocument.toString().toLowerCase().includes(query)) &&
     (el.proofType === parseInt(typeProofDisplay.value as any) || parseInt(typeProofDisplay.value as any) === 0)
  })
}

const syncsales = async () => {
  const res = await store.dispatch('fetchSales')
  sales.value = res.data.reverse()
  salesFilter.value = sales.value
}
</script>

<style>
.h-100 {
  height: 90vh;
}
.oy-scroll {
  overflow-y: scroll;
}
</style>
