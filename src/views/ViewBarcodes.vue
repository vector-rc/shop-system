<template>
  <div class="responsive-container">
    <CardComponent title="Opciones de codigos de barras">
      <form>
        <FieldHorizontal label="Cantidad total">
          <div class="control">
            <input
              type="number"
              class="input"
              required
              v-model.number="stock"
              placeholder="Cantidad"
            />
          </div>
        </FieldHorizontal>
        <FieldHorizontal label="Cantidad por fila">
          <div class="control">
            <select v-model.number="rows" class="input">
              <option value="3">3 por fila</option>
              <option value="2">2 por fila</option>
            </select>
          </div>
        </FieldHorizontal>
        <hr />
        <FieldHorizontal>
          <button type="button" @click="generatePdf()" class="button is-primary">Imprimir Codigos</button>
        </FieldHorizontal>

        <SearchProduct @item-selected="selectItem($event)" />
      </form>
    </CardComponent>

    <!-- <BarcodePdf :code="codeToRender" /> -->
    <RenderBarcodes :product="product" :stock="stock" :rows="rows" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

// import BarcodePdf from '../components/BarcodePdf.vue'
import SearchProduct from '../components/SearchProduct.vue'
import RenderBarcodes from '../components/Barcode/RenderBarcodes.vue'
import CardComponent from '@/components/Shared/CardComponent.vue'
import FieldHorizontal from '@/components/Shared/FieldHorizontal.vue'
const product = ref({})

const stock = ref(6)
const rows = ref(3)

const generatePdf = () => {
  const w: any = window
  w.frames.printf.focus()
  w.frames.printf.print()
}

const selectItem = (p: any) => {
  product.value = p
  console.log(p.code)
}
</script>

<style></style>
