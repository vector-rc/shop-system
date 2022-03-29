<template>
  <div class="menu">
    <iframe ref="pdf" style="width: 1000px; height: 500px;"></iframe>
    <img ref="img" id="barcode" style="display: none;" />
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { PDFDocument } from 'pdf-lib'
import JsBarcode from 'jsbarcode'

const props = defineProps({ code: String })
const pdf = ref()
const img = ref()

watchEffect(async () => {
  console.log('code', props.code)

  JsBarcode('#barcode', props.code as string, { /* format: 'ean13'|'upc' */displayValue: false, height: 50 })
  await createPdf(props.code as string)
})

const createPdf = async (codeToRender: string) => {
  console.log('asdasd')

  const pdfDoc = await PDFDocument.create()
  const pageSize = { // in mm
    height: 31,
    width: 55
  }

  const page = pdfDoc.addPage([pageSize.width, pageSize.height * 3])
  const pngImage = await pdfDoc.embedPng(img.value.src)
  const pngDims = pngImage.scale(0.075)
  const cellWidth = pageSize.width / pngDims.width
  const cellHeight = pageSize.height / pngDims.height
  console.log({ cellWidth }, { cellHeight })

  for (let i = 0; i < Math.trunc(cellWidth); i++) {
    for (let j = 1; j <= Math.trunc(cellHeight); j++) {
      page.drawImage(pngImage, {
        x: (pngDims.width) * i,
        y: pageSize.height - (pngDims.height + 0.8) * j,
        width: pngDims.width,
        height: pngDims.height
      })
      page.drawText(codeToRender, { size: 1, x: pngDims.width / 3 + (pngDims.width) * i, y: pageSize.height - (pngDims.height + 0.8) * j })
    }
  }
  const pdfDataUri = await pdfDoc.saveAsBase64({ dataUri: true })
  pdf.value.src = pdfDataUri
}

</script>

<style>
</style>
