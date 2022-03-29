<template>
  <div class="columns">
    <div class="column">
      <select v-model="printerSelected">
        <option
          v-for="printer of printers"
          :key="printer.vendor_id"
          :value="printer.product_id + '/'+printer.vendor_id  "
        >
          {{ printer.vendor_id }}:{{ printer.product_id }} {{ printer.name }}
        </option>
      </select>
      <button class="button is-primary" @click="selectPrinter()">Guardar</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
const printers = ref([] as any[])
const printerSelected = ref('')

onMounted(async () => {
  const req = await fetch('http://localhost:5050/devices')
  const res = await req.json()
  printers.value = res
  printerSelected.value = localStorage.printer
})
const selectPrinter = () => {
  localStorage.printer = printerSelected.value
}
</script>

<style></style>
