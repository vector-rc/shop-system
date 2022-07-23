<template>
<!-- <div class="modal is-active" v-if="showModalDelete">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head has-background-danger">
        <p class="modal-card-title has-text-white has-text-weight-bold">Advertencia</p>
        <button class="delete" aria-label="close" @click="showModalDelete = false"></button>
      </header>
      <section class="modal-card-body">¿Esta seguro de eliminar este producto? Una vez eliminado ya no se podra recuperar</section>
      <footer class="modal-card-foot">
        <button @click="deleteProduct()" class="button is-danger" :class="{'is-loading':deleting}" :disabled="deleting">Eliminar</button>
        <button @click="showModalDelete = false" class="button">Cancelar</button>
      </footer>
    </div>
  </div> -->
  <div class="columns">
    <div class="column is-11">
      <div class="control has-icons-left">
        <input class="input" type="search" @input="filterProducts()" v-model.trim="querySearch"
          placeholder="Buscar producto" />

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
      <thead>
        <tr style="position:sticky;">
          <!-- <th>ID</th> -->
          <th>Codigo</th>
          <th>Nombre</th>
          <th>Precio</th>
          <!-- <th>Cantidad</th> -->
          <th></th>
        </tr>
      </thead>
      <tbody style="padding-top: 2px;">
        <tr v-for="product of productsFilter" :key="product.id">
          <!-- <td>{{ product.id}}|pi:{{ product.productId}}</td> -->
          <td v-html="resaltWords(querySearch.split(' '), product.code)"></td>
          <td style="cursor:copy" @click="copyProduct(product)"
            v-html="resaltWords(querySearch.split(' '), product.name)"></td>
          <td :style="{ 'color': product.priceSale ? '' : 'red' }">S/.{{ product.priceSale }}</td>
          <!-- <td>{{ product.stock }}</td> -->
          <td>
            <button class="button is-info is-small mx-3" @click="editProduct(product), emit('editProduct', product.productId)">
              <Icon>
                <edit20-regular />
              </Icon>
            </button>
            <!-- <button v-if="user.roleId==2" type="button" class="button is-danger is-small" @click="productIdSelected=product.productId,showModalDelete=true">
              <icon>
                <delete20-regular />
              </icon>
            </button> -->

          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useStore } from 'vuex'
import { Edit20Regular, Search20Regular, ArrowSync20Filled/*, Copy20Regular */ } from '@vicons/fluent'
import { Icon } from '@vicons/utils'
// import { toast } from '@/utils/toast'

const emit = defineEmits(['editProduct'])

const store = useStore()
const products = ref([] as any[])
const productsFilter = ref([] as any[])
const querySearch = ref('')

onMounted(async () => {
  console.log(store.state.user)

  products.value = store.state.products
  productsFilter.value = store.state.products
})

const resaltWords = (words: string[], text: string) => {
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
      const tempProductsFilter: any[] = []
      let matchs: number = 0
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
  // console.log('hola')

  // idProductToEdit.value = product.id
  // toggleAddEdit.value = false
}

// const deleteProduct = async () => {
//   console.log('eliminando producto')
//   deleting.value = true
//   const res = await store.dispatch('deleteProduct', { productId: productIdSelected.value })
//   deleting.value = false
//   showModalDelete.value = false
//   if (res.success) {
//     toast.success(res.message, 3000)
//     await syncProducts()
//   } else {
//     toast.danger(res.message, 3000)
//   }

//   // idProductToEdit.value = product.id
//   // toggleAddEdit.value = false
// }

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
