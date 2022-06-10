<template>
  <FormProof @consultar="consultar($event)" v-if="loading"/>
     <!-- <button type="button" @click="sendSummaries()" class="button is-primary is-medium">Generar y envia resumenes</button> -->

  <div class="d-f" v-if="!loading">
  <div class="d-f fd-c">

    <a :href="xml" class="button is-info" :download="proofData.serie + '-' + proofData.correlative + '.xml'"  >Descargar XML</a>

      <!-- <button type="button" @click="sendSummaries()" class="button is-primary is-medium">Generar y envia resumenes</button>
      <button type="button" @click="sendEmail()" class="button is-primary is-medium">Testear email</button> -->
    <!-- <form class="column is-4">

    </form>-->
    <button type="button" class="button is-info" @click="generatePdf()">Descargar PDF</button>
    <button type="button" class="button is-info" v-if="!loading" @click="loading=true">Nueva consulta</button>
    <!-- <button type="button" class="button is-info" v-if="!loading" @click="testToast()">Nueva consulta</button> -->
  </div>

    <section class="pdf" ref="pdfContent" style="border-radius: 0.5rem;width:850px;height:1000px ;background-color: #fff;padding: 1rem;" v-if="!loading">
      <table style="width:100%;margin: 0.3rem 0">
        <thead>
          <tr>
            <td>
              <div class="ta-c p-2" style="overflow: hidden;">
                <img src="/src/assets/logo.jpg" style="object-fit:cover;width: 50%;height: 120px" alt="">
              </div>
            </td>
            <td rowspan="2">
             <div class="br-1 ta-c p-2 d-f fd-c">

                  <span class="fs-2">RUC 20605808931</span>
                  <br />
                <strong class="fs-3">
                  {{ proof.serie.startsWith('B') ? 'BOLETA ' : 'FACTURA ' }} DE VENTA
                  <br />ELECTRONICA
                </strong>
                <p>
                  <br />
                  <strong class="fs-3">{{ proof.serie }}-{{ buildCorrelative(proof.correlative) }}</strong>
                </p>
              </div>
            </td>
          </tr>

          <tr>
            <td>
              <div class="br-1 ta-c p-2">
                <strong  class="fs-2">INVERSIONES VILVER E.I.R.L</strong>
                <p class="fs-1">
                  Direccion:Jr. Grau 1032
                  <br />Celular: 976757386
                </p>
              </div>
            </td>
            <td></td>
          </tr>
          <tr>
            <td colspan="2">
              <div class="br-1 d-f fs-1 jc-sb p-2">
                <p>
                  <strong>Razon Social:</strong>
                  {{ client.name }}
                  <br />
                  <strong>Fecha de emision:</strong>
                  {{ proof.dateTime }}
                  <br/>
                   <strong>Documento:</strong>
                  {{ client.document?client.document:'--------' }}
                  <br/>
                   <strong>Direccion:</strong>
                 {{ client.address.direccion}} - {{ client.address.departamento}} - {{ client.address.provincia}} - {{ client.address.distrito}}
                  <br />
                </p>
                <!-- <p>
                  <strong>Documento:</strong>
                  {{ client.document }}
                  <br />
                </p> -->
              </div>
            </td>
          </tr>
        </thead>
      </table>
      <div class="br-1 px-1 py-5" style="width:98%;margin:0 .5rem;">
        <table style="width: 100%;font-size: 0.8rem;" class="soldProducts">
          <thead>
            <tr style="border-bottom: 1px solid black; height: 2rem;">
              <th>CODIGO</th>
              <th>CANT</th>
              <th>DESCRIPCION</th>
              <th>PRECIO UNITARIO</th>
              <th>MONTO</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product of soldProducts" :key="product.id" style="height: 2.5rem">
              <td>{{ product.code }}</td>
              <td>{{ product.quantity }}</td>
              <td>{{ product.name }}</td>
              <td>{{currencySymbol}} {{ product.price }}</td>
              <td>{{currencySymbol}} {{ product.mount }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <strong style="display:block;margin:1rem .5rem">{{legend}}</strong>

      <div class="d-f m-4 d-f jc-r">
        <table class="soldProducts" style="width: 50%;" >
           <tbody>
              <tr >
                <th>
                  OPERACIONES GRAVADAS:
                </th>
                <td>
                  {{currencySymbol}} {{round(sale.total *100 / 118,2)}}
                </td>
              </tr>
              <tr >
                <th>
                  I.G.V (18%):
                </th>

                <td>
                  {{currencySymbol}} {{round(sale.total * 18 / 118,2)}}
                </td>
              </tr>
              <tr >
                <th>
                  IMPORTE TOTAL:
                </th>

                <td>
                  {{currencySymbol}} {{sale.total}}
                </td>
              </tr>
            </tbody>
        </table>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { toast } from '@/utils/toast'
import { onMounted, reactive, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useStore } from 'vuex'
import jspdf from 'jspdf'
import FormProof from '@/components/Proof/FormProof.vue'
import { round } from '@/utils/roundDecimal'
import { getCurrencySymbolByIso } from '@/utils/currencies'

const store = useStore()
const route = useRoute()

const decodeData = ref('')
const xml = ref('')
const pdfContent = ref()

const soldProducts = ref([] as any)
const client = ref()
const proof = ref()
const sale = ref()
const legend = ref('')
const currencySymbol = ref('')
const loading = ref(true)

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

function base64ToUtf8 (str: string) {
  return decodeURIComponent(escape(window.atob(str)))
}

const generatePdf = () => {
  const pdf = new jspdf({
    orientation: 'p',
    unit: 'pt',
    format: 'a4'
  })
  // pdf.addFont()
  // pdf.setFont('Helvetica')
  console.log(pdf.getFontList())
  const html = pdfContent.value
  pdf.setFont('Nunito', 'normal')
  pdf.html(html, {
    callback: function (doc) {
      doc.save()
    },
    x: 15,
    y: 15,
    margin: 15,
    windowWidth: 2,
    width: 1.25

  })
  // pdf.save('hahah.pdf')
}

const consultar = async (fieldsProof = '') => {
  loading.value = true
  console.log(fieldsProof === '')

  decodeData.value = fieldsProof === '' ? base64ToUtf8(route.params.encodeData as string) : fieldsProof

  const data = decodeData.value.split('|')
  proofData.ruc = data[0]
  proofData.type = data[1]
  proofData.serie = data[2]
  proofData.correlative = data[3]
  proofData.total = parseFloat(data[5])
  proofData.date = data[6]
  proofData.typeDoc = data[7]
  proofData.numberDoc = data[8]

  const resData = await store.dispatch('fetchProof', { proof: proofData })
  if (!resData.success) {
    toast.danger(resData.message, 4000)
    return
  }

  soldProducts.value = resData.data.soldProducts
  sale.value = resData.data.sale
  currencySymbol.value = getCurrencySymbolByIso(sale.value.currencyType)

  client.value = resData.data.client
  if (!client.value)client.value = {}
  if (!client.value.address) {
    client.value.address = {
      departamento: '--',
      provincia: '--',
      distrito: '--',
      direccion: '--',
      ubigeo: '--'
    }
  }
  proof.value = resData.data.proof
  legend.value = resData.data.legend

  const blob = new Blob([proof.value.xml], { type: 'aplication/xml' })

  xml.value = window.URL.createObjectURL(blob)
  // xml.value = utf8ToBase64(resData.data.proof.xml)
  toast.success(resData.message, 4000)
  loading.value = false
}

onMounted(async () => {
  if (route.params.encodeData !== 'consultar') {
    await consultar()
  }
})

const buildCorrelative = (correlative: number) => {
  let zeros = ''
  for (let i = 0; i < 8 - correlative.toString().length; i++) {
    zeros += '0'
  }
  return zeros + correlative.toString()
}

</script>

<style>
.pdf {
  font-family: Arial, Helvetica, sans-serif;
}

.br-1 {
  border-radius: 0.5rem;
  border: solid #1d1d1d 1px;
  margin: 0.5rem;
}

.fs-1 {
  font-size: 1rem;
}
.fs-2 {
  font-size: 1.5rem;
}
.fs-3 {
  font-size: 2rem;
}

.ta-c {
  text-align: center;
}

.d-f {
  display: flex;
}
.fd-c {
  flex-direction: column;
}
.jc-sb {
  justify-content: space-between;
}
.jc-r {
  justify-content: right;
}
.soldProducts tr {
  border-bottom: solid 1px #1d1d1d;
}
</style>
