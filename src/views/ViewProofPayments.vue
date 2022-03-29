<template>
<div class="columns">
  <a :href="xml" :download="proofData.serie+'-'+proofData.correlative+'.xml'">Descargar xml</a>

  <!-- <form class="column is-4">

    <button type="button" @click="sendSummaries()" class="button is-primary is-medium">Generar y envia resumenes</button>
    <button type="button" @click="sendEmail()" class="button is-primary is-medium">Testear email</button>

  </form> -->
</div>
</template>

<script setup lang="ts">
import { toast } from '@/utils/toast'
import { onMounted, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useStore } from 'vuex'

const store = useStore()
const decodeData = ref('')

const route = useRoute()

const xml = ref('')

const proofData = reactive({
  ruc: '',
  type: '',
  serie: '',
  correlative: '',
  total: 0,
  date: '',
  typeDoc: '',
  numberDoc: ''
})

function utf8ToBase64 (str:string) {
  return window.btoa(unescape(encodeURIComponent(str)))
}

function base64ToUtf8 (str:string) {
  return decodeURIComponent(escape(window.atob(str)))
}

onMounted(async () => {
  decodeData.value = base64ToUtf8(route.params.encodeData as string)
  const data = decodeData.value.split('|')
  proofData.ruc = data[0]
  proofData.type = data[1]
  proofData.serie = data[2]
  proofData.correlative = data[3]
  proofData.total = parseInt(data[5])
  proofData.date = data[6]
  proofData.typeDoc = data[7]
  proofData.numberDoc = data[8]

  const resData = await store.dispatch('fetchProof', { proof: proofData })
  if (!resData.success) {
    toast.danger(resData.message)
    return
  }
  const blob = new Blob([resData.data.proof.xml], { type: 'aplication/xml' })

  xml.value = window.URL.createObjectURL(blob)
  // xml.value = utf8ToBase64(resData.data.proof.xml)
  toast.success(resData.message)
})

// const sendSummaries = () => {
//   const dataSummaries = store.dispatch('sendSummaries')
//   console.log(dataSummaries)
// }
// const sendEmail = () => {
//   store.dispatch('testEmail')
// }

</script>

<style></style>
