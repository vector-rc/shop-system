<template>
<div class="panel">
   <div class="panel-block">
    <p class="control has-icons-left">
        <input class="input upper" type="search" @input="filterProducts()" v-model.trim="querySearch" placeholder="Buscar producto">

      <icon class="icon is-left">
        <search20-filled/>

      </icon>
    </p>
  </div>
  <!-- <ul class="menu-list"  style="position:absolute;height: auto;max-height:20rem;overflow-y: scroll;" > -->
      <a :title="'S/. '+product.priceSale" class="panel-block" style="display: block;" @click="emit('itemSelected',product)" v-for="product of productsFilter" :key="product.id" v-html="resaltWords(product.name)" ></a>
  <!-- </ul> -->
</div>

</template>

<script setup lang="ts">
import { Icon } from '@vicons/utils'
import { Search20Filled } from '@vicons/fluent'

import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'

const emit = defineEmits(['itemSelected'])

const store = useStore()
const products = ref([] as any[])
const productsFilter = ref([] as any[])
const querySearch = ref('' as string)

onMounted(async () => {
  await store.dispatch('fetchProducts')
  products.value = store.state.products
})

const resaltWords = (text:string) => {
  const words = querySearch.value.split(' ')
  if (words.length === 0) return
  words.forEach(w => {
    w = w.toString().replaceAll(/[\[\]\/]/ig, '')
    text = text.toString().toLocaleUpperCase().replace(w.toLocaleUpperCase(), `[]${w.toLocaleUpperCase()}[/]`)
  })
  text = text.toString().replace('[]', '<span style="background:#6eeeeebb">')
  text = text.toString().replace('[/]', '</span>')
  return text
}

const filterProducts = () => {
  if (querySearch.value === '') {
    productsFilter.value = []
    return
  }
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
      console.log(tempProductsFilter)

      productsFilter.value = tempProductsFilter.sort((a, b) => b.matchs - a.matchs).slice(0, 15)
    }
  }, 500)
}

</script>

<style>

</style>
