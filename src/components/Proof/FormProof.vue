<template>
  <card-component title="Consultar comprobante de pago electronico" :icon="DocumentBulletList20Regular" style="width:40rem" >
    <form @submit.prevent="submit" ref="form">
      <!-- <field-vertical label="Avatar">
          <p class="control is-expanded">
            <file-picker type="is-info" />
          </p>
      </field-vertical>
      <hr /> -->

      <field-vertical label="Tipo de comprobante">
          <p class="control">
            <span class="select">
        <select v-model="proof.type">
          <option value="03">Boleta</option>
          <option value="01">Factura</option>
        </select>
      </span>
          </p>
      </field-vertical>
      <hr />
      <field-vertical label="Serie-Correlativo del comprobante">
          <p class="control">
            <input class="input is-uppercase" required v-model="proof.serieCorrelative" placeholder="Ej. FXXX-00000000"/>
          </p>
      </field-vertical>
      <hr />
      <field-vertical label="Tipo de Documento del Cliente">
          <p class="control">
            <span class="select">

            <select v-model="proof.clientDocType" :disabled="proof.type==='01'">
                      <option
                        v-for="doc in documentTypes"
                        :key="doc.code"
                        :value="doc.code"
                      >{{ doc.name }}</option>
                    </select>
                  </span>
          </p>
      </field-vertical>
      <hr />
      <field-vertical label="Numero de Documento">
          <p class="control">
            <input class="input is-uppercase" required v-model="proof.clientDoc" placeholder="Ej. 855778999"/>
          </p>
      </field-vertical>
      <hr />
        <field-vertical label="Fecha de emision">
            <p class="control">
              <input class="input" type="date" required v-model="proof.date" />
            </p>
        </field-vertical>
      <hr />
        <field-vertical label="Importe Total">
            <p class="control">
              <input class="input" type="number" step="0.01" required v-model="proof.totalMount" />
            </p>
        </field-vertical>
      <hr />

      <field-vertical>
        <div class="control">
          <button class="button is-primary">Consultar</button>
          <button  type="reset" class="button is-outlined is-primary">Reset</button>
        </div>
      </field-vertical>
    </form>
  </card-component>
</template>

<script setup>
// import FilePicker from '@/components/Shared/FilePicker.vue'
import CardComponent from '@/components/Shared/CardComponent.vue'
import FieldVertical from '../Shared/FieldVertical.vue'
import { useStore } from 'vuex'
import { reactive, ref, watchEffect } from 'vue'
import { DocumentBulletList20Regular } from '@vicons/fluent'

const emit = defineEmits(['consultar'])
const store = useStore()
const isLoading = ref(false)
const form = ref()

const documentTypes = [
  { code: '01', name: 'DNI', length: 8 },
  { code: '04', name: 'CARNET DE EXTRANGERIA', length: 12 },
  { code: '06', name: 'RUC', length: 11 },
  { code: '07', name: 'PASAPORTE', length: 12 }
]

const proof = reactive({
  type: '03',
  serieCorrelative: '',
  date: '',
  totalMount: 0,
  clientDoc: '',
  clientDocType: '01'
})

// function utf8ToBase64 (str: string) {
//   return window.btoa(unescape(encodeURIComponent(str)))
// }

watchEffect(() => {
  proof.clientDocType = proof.type === '01' ? '06' : proof.clientDocType
})
console.log(store)

const submit = () => {
  isLoading.value = true
  proof.serieCorrelative = proof.serieCorrelative.toLocaleUpperCase()
  const consulta = `20605808931|${proof.type}|${proof.serieCorrelative.replace('-', '|')}|00|${proof.totalMount}|${proof.date}|${proof.clientDocType}|${proof.clientDoc}`
  emit('consultar', consulta)
}

</script>
