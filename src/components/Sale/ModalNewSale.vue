<template>
  <div class="modal is-active" v-if="show">
    <div class="modal-background"></div>

    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Nueva Venta</p>
        <button class="delete" aria-label="close" @click="emit('hide')"></button>
      </header>
      <section class="modal-card-body">
        <label for="ticket" class="button" :class="{'is-primary':(typeProof === 'ticket')}">Ticket</label>
        <label for="boleta" class="button" :class="{'is-primary':(typeProof === 'boleta')}">Boleta</label>
        <label for="factura" class="button" :class="{'is-primary':(typeProof === 'factura')}">Factura</label>

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
                    <select v-model="client.documentType" :disabled="typeProof==='factura'">
                      <option
                        v-for="doc in documentTypes"
                        :key="doc.code"
                        :value="doc.code"
                      >{{ doc.name }}</option>
                    </select>
                  </span>
                </p>
                <p class="control">
                  <input
                    class="input is-upper"
                    :placeholder="documentType.name"
                    @input="validate(),getInfoDoc()"
                    v-model="client.document"
                  />
                </p>
              </div>
            </div>

          </div>
          <div class="field">
              <p class="control is-expanded">
                <input
                  class="input is-upper"
                  placeholder="nombre"
                  type="text"
                  v-model="client.name"
                  :disabled="client.documentType===6 || client.documentType===1"

                />
              </p>
            </div>
          <div class="field" v-if="typeProof==='factura'">
              <p class="control is-expanded">
                <input
                  class="input"
                  placeholder="Email"
                  type="text"
                  v-model="client.email"
                />
              </p>
            </div>
        </div>

      </section>
      <footer class="modal-card-foot">
        <button :disabled="loading" @click="validateClient()" class="button is-success">Guardar e Imprimir {{typeProof}}</button>
        <!-- <button :disabled="loading" @click="validateClient()" class="button is-success">Solo guardar {{typeProof}}</button> -->
        <button @click="emit('hide')" class="button">Cancelar</button>
      </footer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect, reactive, computed } from 'vue'
import { useStore } from 'vuex'
import { toast } from '@/utils/toast.js'

const store = useStore()

const props = defineProps({ show: Boolean, client: Object, loading: { type: Boolean, default: false } })
const emit = defineEmits(['save', 'hide'])

const show = ref(props.show)
const loading = ref(props.loading)

const typeProof = ref('ticket')

const documentTypes = [
  { code: 1, name: 'DNI', length: 8 },
  { code: 4, name: 'CARNET DE EXTRANGERIA', length: 12 },
  { code: 6, name: 'RUC', length: 11 },
  { code: 7, name: 'PASAPORTE', length: 12 }
]

const client = reactive(props.client as any)

watchEffect(() => {
  show.value = props.show
})

watchEffect(() => {
  loading.value = props.loading
})

watchEffect(() => {
  client.documentType = 1
  client.document = ''
  client.name = ''
  client.email = ''
  if (typeProof.value === 'factura') {
    client.documentType = 6
    client.document = ''
    client.name = ''
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
  client.name = infoClient.nombre
}

const validateClient = () => {
  if (typeProof.value !== 'ticket') {
    if (client.document === '' || client.name === '') {
      toast.warning('El documento o el nombre no puede ser vacio')
      return
    }

    if (typeProof.value === 'factura') {
      if (client.email === '') {
        toast.warning('Se nesesita un email para emitir factura')
        return
      }
    }
  }

  emit('save', typeProof.value)
}

const validate = () => {
  client.document = client.document.replace(/\D/, '')
  if (client.document.length > documentType.value.length) {
    client.document = client.document.slice(0, documentType.value.length)
  }
}

</script>
