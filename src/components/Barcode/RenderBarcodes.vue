<template>
    <CardComponent title="Previsualizacion">
        <iframe id="printf" name="printf" ref="pdf" style="width: 100%; height:30rem;" :srcdoc="render"></iframe>
        <img ref="img" id="barcode" style="display: none;" />
    </CardComponent>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import JsBarcode from 'jsbarcode'
import CardComponent from '../Shared/CardComponent.vue'

const props = defineProps({ product: Object, stock: Number, rows: Number })
const pdf = ref()
const img = ref()
const render = ref('')

const renderBarcodesX3 = async (product:any, stock:number) => {
  const imgB64 = img.value.src
  let tempDoc = `
   <html style="width:105mm;padding:0;margin:0" >
  <head>
   </head>
   <body style="width:105mm;padding:0;margin:0">`// + `
  // <div style="margin:0 2.5mm;padding:0;width:103mm;display:grid;grid-template-columns: repeat(3, 1fr);font-family:arial;font-weight: bold;justify-content:center ;height:21mm ;page-break-after: always">`

  for (let i = 0; i < Math.ceil(stock / 3); i++) {
    tempDoc += '<div style="display:block;width:110mm;margin:0 auto">'
    tempDoc += '<div style="margin:0 auto;padding:0 3mm 0 3mm;width:100%;display:flex;grid-template-columns: repeat(3, 1fr);font-family:arial;font-weight: bold;justify-content:space-evenly ;height:20mm ;page-break-after: always">'
    for (let j = 0; j < 3; j++) {
      tempDoc += `<div style="display: flex;flex-direction: column;align-items: center;font-size: 10px;widt:30mm;max-width:30mm;border:1px solid black;padding:2px;text-align:center;height:19mm">
    <span style="margin: 0;padding: 0;z-index: 1;word-wrap:break-word;word-break: break-all;">${product.name}</span>
    <img style="width:29mm" src="${imgB64}"/>
    <span style="margin: 0;padding: 0;z-index: 1">${product.code}</span>
    </div>`
    }
    tempDoc += '</div></div>'
  }
  tempDoc += `</div> </body>
  </html>`

  render.value = tempDoc
}

const renderBarcodesX2 = async (product:any, stock:number) => {
  const imgB64 = img.value.src
  let tempDoc = `
   <html style="width:105mm;padding:0;margin:0" >
  <head>
   </head>
   <body style="width:105mm;padding:0;margin:0">`// + `

  for (let i = 0; i < Math.ceil(stock / 2); i++) {
    tempDoc += '<div style="display:block;width:108mm;margin:0 auto">'
    tempDoc += '<div style="margin:0 auto;padding:0;width:100%;display:flex;grid-template-columns: repeat(2, 1fr);font-family:arial;font-weight: bold;justify-content:space-evenly ;height:25mm ;page-break-after: always">'
    for (let j = 0; j < 2; j++) {
      tempDoc += `<div style="display: flex;flex-direction: column;align-items: center;font-size: 10px;max-width:45mm;border:1px solid black;padding:2px;text-align:center;justify-content:center;height:24mm">
    <span style="margin: 0;padding: 0;z-index: 1;word-wrap:break-word;word-break: break-all;">${product.name}</span>
    <img style="width:42mm" src="${imgB64}"/>
    <span style="margin: 0;padding: 0;z-index: 1">${product.code}</span>
    </div>`
    }
    tempDoc += '</div></div>'
  }
  tempDoc += `</div> </body>
  </html>`

  render.value = tempDoc
}

watchEffect(async () => {
  JsBarcode('#barcode', (props.product as any).code, { /* format: 'ean13'|'upc' */displayValue: false, height: 20, width: 1, margin: 0 })
  if (props.rows === 2) {
    await renderBarcodesX2(props.product as any, props.stock as number)
  } else {
    await renderBarcodesX3(props.product as any, props.stock as number)
  }
})

</script>

<style>
</style>
