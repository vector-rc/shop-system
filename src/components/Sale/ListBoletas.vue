<template>
  <div class="columns">
    <div class="column is-11">
      <div class="control has-icons-left">
        <input
          class="input"
          type="search"
          @input="filterSales()"
          v-model.trim="querySearch"
          placeholder="Buscar venta"
        />

        <Icon class="icon is-large is-left">
          <search20-regular />
        </Icon>
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
      <thead >
      <tr style="position:sticky;">
        <th>ID</th>
        <th>Codigo</th>
        <th>Cliente</th>
        <th>Documento Cliente</th>
        <th>Fecha emision</th>
        <th>Importe Total</th>
        <th></th>
      </tr>
      </thead>
      <tbody style="padding-top: 2px;">
        <tr v-for="sale of salesFilter" :key="sale.id">
          <td>{{ sale.id}}</td>
          <td>{{ sale.code }}</td>
          <td >{{sale.client}}</td>
          <td>{{ sale.document }}</td>
          <td>{{ sale.dateTime }}</td>
          <td>{{ sale.total }}</td>
          <td >
            <button class="button is-info is-small" @click="editsale(sale),emit('editsale',sale.saleId)">
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
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { Edit20Regular, Search20Regular, ArrowSync20Filled /*, Copy20Regular */ } from '@vicons/fluent'
import { Icon } from '@vicons/utils'

const emit = defineEmits(['editsale'])

const store = useStore()
const sales = ref([] as any[])
const salesFilter = ref([] as any[])
const querySearch = ref('')

onMounted(async () => {
  const res = await store.dispatch('fetchSales')
  sales.value = res.data
  salesFilter.value = res.data
})

const filterSales = () => {
  const query = querySearch.value.toLowerCase()
  const words = query.split(' ')
  const tempsalesFilter:any[] = []

  words.forEach((word, index) => {
    if (word.length < 2) return
    const p = sales.value.filter(
      ({ name, code }: any) =>
        name.toLowerCase().includes(word) ||
      code.toString().toLowerCase().includes(word)
    )

    p.forEach((el, index) => {
      if (tempsalesFilter.length === 0) {
        tempsalesFilter.push(el)
        return
      }
      if (tempsalesFilter.every(({ id }) => id !== el.id)) {
        tempsalesFilter.push(el)
      } else {
        const i = tempsalesFilter.findIndex(({ id }) => id === el.id)
        tempsalesFilter.splice(i, 1)
        tempsalesFilter.unshift(el)
      }
    })
  })
  salesFilter.value = tempsalesFilter
  // salesFilter.value = sales.value.filter(
  //   ({ name, code }: any) =>
  //     name.toLowerCase().includes(query) ||
  //     code.toString().toLowerCase().includes(query)
  // )
}
// const idsaleToEdit: any = inject('idsaleToEdit')
// const toggleAddEdit: any = inject('toggleAddEdit')

const editsale = (sale: any) => {
  console.log('hola')

  // idsaleToEdit.value = sale.id
  // toggleAddEdit.value = false
}

const syncsales = async () => {
  await store.dispatch('fetchsales')
  sales.value = store.state.sales
  salesFilter.value = store.state.sales
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
