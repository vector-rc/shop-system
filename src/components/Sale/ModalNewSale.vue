<template>
  <div class="modal is-active" v-if="show">
    <div class="modal-background"></div>

    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Nueva Venta</p>
        <button class="delete" aria-label="close" @click="emit('hide')"></button>
      </header>
      <section class="modal-card-body">
        <div style="display:flex">
          <label for="ticket" class="button" :class="{ 'is-primary': (typeProof === 'ticket') }">Ticket</label>
          <label for="boleta" class="button" :class="{ 'is-primary': (typeProof === 'boleta') }">Boleta</label>
          <label for="factura" class="button" :class="{ 'is-primary': (typeProof === 'factura') }">Factura</label>

        </div>

        <div style="display: none;">
          <input type="radio" v-model="typeProof" id="boleta" value="boleta" />
          <input type="radio" v-model="typeProof" id="factura" value="factura" />
          <input type="radio" v-model="typeProof" id="ticket" value="ticket" />
        </div>

        <div v-if="typeProof !== 'ticket'" class="column">
          <div class="field is-horizontal">
            <div class="field-body">
              <div class="field has-addons">
                <p class="control">
                  <span class="select">
                    <select v-model="client.documentType" :disabled="typeProof === 'factura'">
                      <option v-for="doc in documentTypes" :key="doc.code" :value="doc.code">{{ doc.name }}</option>
                    </select>
                  </span>
                </p>
                <p class="control">
                  <input class="input is-upper" :placeholder="documentType.name" @input="validate(), getInfoDoc()"
                    v-model="client.document" />
                </p>
              </div>
            </div>
          </div>

              <div class="field is-horizontal">
            <div class="field-body">
              <div class="field has-addons">
                <p class="control">
                  <span class="input">
                    MONEDA
                  </span>
                </p>
                <div class="control">
                  <span class="select">
                    <select v-model="typeCurrency">
                      <option v-for="curr in currencies" :key="curr.ISOCode" :value="curr.ISOCode">{{ curr.name }}
                      </option>
                    </select>
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div class="field">
            <p class="control is-expanded">
              <input class="input is-upper" placeholder="nombre" type="text" v-model="client.name"
                :disabled="client.documentType === 6 || client.documentType === 1" />
            </p>
          </div>
          <div class="field is-horizontal" v-if="typeProof === 'factura'">
            <div class="field-body">
              <div class="field has-addons">
                <p class="control">
                  <input class="input is-upper" placeholder="DEPARTAMENTO" v-model="client.address.departamento" />
                </p>
                <p class="control">
                  <input class="input is-upper" placeholder="PROVINCIA" v-model="client.address.provincia" />
                </p>
                <p class="control">
                  <input class="input is-upper" placeholder="DISTRITO" v-model="client.address.distrito" />
                </p>
              </div>
            </div>

          </div>
          <div class="field" v-if="typeProof === 'factura'">
            <p class="control is-expanded">
              <input class="input" placeholder="DIRECCION" type="text" v-model="client.address.direccion" />
            </p>
          </div>
          <div class="field" v-if="typeProof === 'factura'">
            <p class="control is-expanded">
              <input class="input" placeholder="Email" type="text" v-model="client.email" />
            </p>
          </div>
        </div>

      </section>
      <footer class="modal-card-foot">
        <button :disabled="loading" @click="validateClient()" class="button is-success">Guardar e Imprimir
          {{ typeProof }}</button>
        <!-- <button :disabled="loading" @click="validateClient()" class="button is-success">Solo guardar {{typeProof}}</button> -->
        <button @click="emit('hide'), resetForm()" class="button">Cancelar</button>
      </footer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect, reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { toast } from '@/utils/toast.js'
import { currencies } from '@/utils/currencies'

const store = useStore()

const props = defineProps({ show: Boolean, client: Object, loading: { type: Boolean, default: false } })
const emit = defineEmits(['save', 'hide'])

const show = ref(props.show)
const loading = ref(props.loading)

const typeProof = ref('ticket')
const typeCurrency = ref('PEN')

const documentTypes = [
  { code: 1, name: 'DNI', length: 8 },
  { code: 4, name: 'CARNET DE EXTRANGERIA', length: 12 },
  { code: 6, name: 'RUC', length: 11 },
  { code: 7, name: 'PASAPORTE', length: 12 },
  { code: 0, name: 'SIN DOCUMENTO', length: 0 }
]

const client = reactive(props.client as any)

watchEffect(() => {
  show.value = props.show
})

watchEffect(() => {
  client.name = client.name.toLocaleUpperCase()
})

watchEffect(() => {
  loading.value = props.loading
})

const resetForm = () => {
  typeProof.value = 'boleta'
  client.documentType = 1
  client.document = ''
  client.name = ''
  client.email = ''
  client.address = ''
  client.address = {
    departamento: '',
    provincia: '',
    distrito: '',
    direccion: '',
    ubigeo: ''
  }
}

watchEffect(() => {
  if (!show.value) {
    resetForm()
  }
})

watchEffect(() => {
  if (typeProof.value === 'factura') {
    client.documentType = 6
  }
})

const documentType: any = computed(() => {
  return documentTypes.find(el => el.code === client.documentType)
})

const getInfoDoc = async () => {
  if (documentType.value.code !== 1 && documentType.value.code !== 6) return
  if (('' + client.document).length !== documentType.value.length) {
    client.name = ''
    return
  }
  const infoClient = await store.dispatch('getInfoDoc', { typeDoc: documentType.value.code, document: client.document })
  if (infoClient === null || infoClient.error) {
    toast.warning('Este numero de ' + documentType.value.name + ' no existe')
    return
  }
  if (infoClient.name) {
    client.name = infoClient.name
    client.email = infoClient.email
    client.address = infoClient.address ?? {
      departamento: '-',
      provincia: '-',
      distrito: '-',
      direccion: '-',
      ubigeo: '-'
    }
    return
  }
  client.name = infoClient.nombre
  client.email = infoClient.email ?? ''
  client.address =
  {
    departamento: !infoClient.departamento ? '-' : infoClient.departamento,
    provincia: !infoClient.provincia ? '-' : infoClient.provincia,
    distrito: !infoClient.distrito ? '-' : infoClient.distrito,
    direccion: !infoClient.direccion ? '-' : infoClient.direccion,
    ubigeo: !infoClient.ubigeo ? '-' : infoClient.ubigeo
  }
  console.log(JSON.stringify(client.address))
}

const validateClient = () => {
  if (typeProof.value !== 'ticket') {
    if (client.name === '') {
      toast.warning('El nombre no puede ser vacio')
      return
    }
    if (client.documentType !== 0 && client.name === '') {
      toast.warning('El documento no puede ser vacio')
      return
    }

    if (typeProof.value === 'factura') {
      if (client.email === '') {
        toast.warning('Se nesesita un email para emitir factura')
        return
      }
    }
  }

  emit('save', { typeProof: typeProof.value, currency: typeCurrency.value })
}

const validate = () => {
  client.document = client.document.replace(/\D/, '')
  if (client.document.length > documentType.value.length) {
    client.document = client.document.slice(0, documentType.value.length)
  }
}

</script>
