<template>
 <card-component title="Generar reportes"  >
    <form @submit.prevent="submit">
      <field-horizontal label="Fecha Inicio">
          <p class="control">
            <input class="input" type="date" required v-model="dateFrom" />
          </p>
      </field-horizontal>
      <hr />
      <field-horizontal label="Fecha fin">
          <p class="control">
            <input class="input" type="date" required v-model="dateTo" />
          </p>
      </field-horizontal>

      <field-horizontal>
        <div class="control">
          <button class="button is-primary" :class="{'is-loading':isLoading}">Generar</button>
        </div>
      </field-horizontal>
      <!-- <field-horizontal>
        <div class="control">
          <a class="button is-primary" :class="{'is-loading':isLoading}">Descargar</a>
        </div>
      </field-horizontal> -->
    </form>
  </card-component>
  <div class="control" style="margin: 2rem" v-if="user.roleId==2">
    <button type="button" @click="sendSummaries()"  class="button is-primary" :class="{'is-loading':isLoading}">Generar y enviar resumenes</button>
  </div>

</template>

<script setup lang="ts">
import CardComponent from '@/components/Shared/CardComponent.vue'
import FieldHorizontal from '@/components/Shared/FieldHorizontal.vue'
import { ref } from 'vue'
import { toast } from '@/utils/toast'

import { useStore } from 'vuex'

const store = useStore()

const dateFrom = ref(null)
const dateTo = ref(null)
const isLoading = ref(false)

const user = store.state.user

const submit = async () => {
  const res = await store.dispatch('donwloadProofReports', { dateFrom: dateFrom.value, dateTo: dateTo.value })
  // console.log(res)
  downloadBlob(res, Date.now() + '_report.xlsx')
  isLoading.value = true
  toast.success(res.message, 5000)
  isLoading.value = false
}
function downloadBlob (blob:Blob, name = 'file.txt') {
  const blobUrl = URL.createObjectURL(blob)

  // Create a link element
  const link = document.createElement('a')

  // Set link's href to point to the Blob URL
  link.href = blobUrl
  link.download = name

  // Append link to the body
  document.body.appendChild(link)

  // Dispatch click event on the link
  // This is necessary as link.click() does not work on the latest firefox
  link.dispatchEvent(
    new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    })
  )

  // Remove link from body
  document.body.removeChild(link)
}

const sendSummaries = async () => {
  const dataSummaries = await store.dispatch('sendSummaries')
  console.log(dataSummaries)
}

</script>

<style>

</style>
