<template>
  <div class="columns">
    <div class="column is-11">
      <div class="control has-icons-left">
        <input
          class="input"
          type="search"
          @input="filterProducts()"
          v-model.trim="querySearch"
          placeholder="Buscar producto"
        />

        <Icon class="icon is-large is-left">
          <search20-regular />
        </Icon>
      </div>
    </div>

    <div class="column is-1">
      <button class="button is-primary" @click="syncProducts()">
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
        <!-- <th>ID</th> -->
        <th>Codigo</th>
        <th>Nombre</th>
        <th>Precio</th>
        <th>Cantidad</th>
        <th></th>
      </tr>
      </thead>
      <tbody style="padding-top: 2px;">
        <tr v-for="product of productsFilter" :key="product.id">
          <!-- <td>{{ product.id}}|pi:{{ product.productId}}</td> -->
          <td v-html="resaltWords(querySearch.split(' '),product.code)"></td>
          <td style="cursor:copy" @click="copyProduct(product)" v-html="resaltWords(querySearch.split(' '),product.name)"></td>
          <td>S/.{{ product.priceSale }}</td>
          <td>{{ product.stock }}</td>
          <td >
            <button class="button is-info is-small" @click="editProduct(product),emit('editProduct',product.productId)">
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

const emit = defineEmits(['editProduct'])

const store = useStore()
const products = ref([] as any[])
const productsFilter = ref([] as any[])
const querySearch = ref('')

onMounted(async () => {
  products.value = store.state.products
  productsFilter.value = store.state.products
})

const resaltWords = (words:string[], text:string) => {
  if (words.length === 0) return text
  words.forEach(w => {
    w = w.toString().replaceAll(/[\[\]\/]/ig, '')
    text = text.toString().toLocaleUpperCase().replace(w.toLocaleUpperCase(), `[]${w.toLocaleUpperCase()}[/]`)
  })
  text = text.toString().replaceAll('[]', '<span style="background:#6eeeeebb">')
  text = text.toString().replaceAll('[/]', '</span>')

  return text
}

const filterProducts = () => {
  const beforeQuery = querySearch.value
  setTimeout(() => {
    if (beforeQuery === querySearch.value) {
      const query = querySearch.value.toLowerCase()
      const words = query.split(' ')
      const tempProductsFilter:any[] = []
      let matchs:number = 0
      products.value.forEach((p) => {
        matchs = 0
        words.forEach((w) => {
          if (p.name.toLowerCase().includes(w) ||
      p.code.toString().toLowerCase().includes(w)) matchs += 1
        })
        if (matchs !== 0) {
          p.matchs = matchs
          tempProductsFilter.push(p)
        }
      })
      // console.log(tempProductsFilter)

      productsFilter.value = tempProductsFilter.sort((a, b) => b.matchs - a.matchs)
    }
  }, 500)
}
// const idProductToEdit: any = inject('idProductToEdit')
// const toggleAddEdit: any = inject('toggleAddEdit')

const editProduct = (product: any) => {
  console.log('hola')

  // idProductToEdit.value = product.id
  // toggleAddEdit.value = false
}
const copyProduct = (product: any) => {
  navigator.clipboard.writeText(product.name)
}

onMounted(async () => {
  await syncProducts()
})

const syncProducts = async () => {
  await store.dispatch('fetchProducts')
  products.value = store.state.products
  productsFilter.value = store.state.products
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
