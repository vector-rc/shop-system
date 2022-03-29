<template>
    <div class="modal is-active" v-if="show">
        <div class="modal-background"></div>

        <div class="modal-card">
            <header class="modal-card-head">
                <p class="modal-card-title">Agregar producto manual</p>
                <button class="delete" aria-label="close" @click="emit('hide')"></button>
            </header>
            <section class="modal-card-body">

            <div class="field">
            <label class="label">Nombre del producto</label>

              <p class="control">
                <input class="input is-upper" placeholder="NOMBRE" v-model="manualProduct.name" />
              </p>

            </div>
        <div class="field is-horizontal">
          <div class="field-body">
            <div class="field">
              <label class="label">Precio</label>

              <p class="control" >
                <input
                  class="input is-upper"
                  placeholder="Precio"
                  min="0.1"
                  step="0.01"
                  v-model="manualProduct.priceSale"
                />
              </p>
            </div>
            <div class="field">
              <label class="label">Cantidad</label>
              <p class="control" >
                <input
                  class="input is-upper"
                  placeholder="Precio"
                  min="0.1"
                  step="0.01"
                  v-model="manualProduct.quantity"
                />
              </p>

            </div>
          </div>
        </div>

            </section>
            <footer class="modal-card-foot">
                <button  @click="addManualProduct()" class="button is-success">Agregar producto</button>
                <button @click="emit('hide')" class="button">Cancelar</button>
            </footer>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect, reactive } from 'vue'

const props = defineProps({ show: Boolean })
const emit = defineEmits(['addProduct', 'hide'])

const show = ref(props.show)

const manualProduct = reactive({
  id: 'MP' + Date.now(),
  code: 'MP' + Date.now(),
  name: '',
  priceSale: 0,
  quantity: 1
})

const addManualProduct = () => {
  manualProduct.name = manualProduct.name.toLocaleUpperCase()
  emit('addProduct', manualProduct)
  manualProduct.id = 'MP' + Date.now()
  manualProduct.code = 'MP' + Date.now()
  manualProduct.name = ''
  manualProduct.priceSale = 0
  manualProduct.quantity = 1
  emit('hide')
}

watchEffect(() => {
  show.value = props.show
})

</script>
