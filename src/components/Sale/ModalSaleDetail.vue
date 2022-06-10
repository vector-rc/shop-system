<template>
  <div class="modal is-active" style="z-index: 9999 ;" v-if="showModalBaja">
    <div class="modal-background"></div>
    <div class="modal-content" style="width: 35%; height: 30%;">
      <article class="message is-danger">
        <div class="message-header">
          <p>Danger</p>
          <button class="delete" @click="showModalBaja = false" aria-label="delete"></button>
        </div>
        <div class="message-body">
          <span>¿¿ Esta seguro de dar de baja esta {{ typeProof }}?</span>
          <span>Una vez que se dea de baja ya no se podra recuperar</span>
          <br />
          <br />
          <div class="field" v-if="typeProof === 'factura'">
            <label class="label">Motivo de Baja</label>
            <p class="control">
              <input
                class="input is-upper"
                placeholder="ejemplo: ruc equibocado"
                v-model="motivoBaja"
              />
            </p>
          </div>
          <button
            :disabled="waitingBaja"
            class="button is-danger mx-2"
            @click="darDeBaja()"
            :class="{ 'is-loading': waitingBaja }"
          >Dar de baja</button>
          <button class="button" @click="showModalBaja = false">Cancelar</button>
        </div>
      </article>
    </div>
  </div>
  <div class="modal is-active" style="z-index: 9999 ;" v-if="showModalEmail">
    <div class="modal-background"></div>
    <div class="modal-content" style="width: 35%; height: 30%;">
      <article class="message is-primary">
        <div class="message-header">
          <p>Enviar comprobante por email</p>
          <button class="delete" @click="showModalEmail = false" aria-label="delete"></button>
        </div>
        <div class="message-body">
          <div class="field">
            <label class="label">Email:</label>
            <p class="control">
              <input
                :class="{ 'is-danger': !validEmail }"
                class="input"
                type="email"
                placeholder="mail@example.com"
                v-model="client.email"
              />
            </p>
          </div>
          <button
            :disabled="waitingSendEmail || !validEmail"
            class="button is-primary mx-2"
            @click="sendByEmail()"
            :class="{ 'is-loading': waitingSendEmail }"
          >Enviar</button>
          <button class="button" @click="showModalEmail = false">Cancelar</button>
        </div>
      </article>
    </div>
  </div>

  <div class="modal is-active" v-if="show && loadAll">
    <div class="modal-background"></div>

    <div class="modal-card" style="width: 50%; height: 70%;">
      <header class="modal-card-head">
        <p class="modal-card-title">Detalles de la venta</p>
        <button class="delete" aria-label="close" @click="emit('hide')"></button>
      </header>
      <section class="modal-card-body">
        <table class="table is-narrow is-hoverable is-bordered is-striped is-fullwidth">
          <thead>
            <tr style="position:sticky;">
              <th colspan="5" style="text-align: center;">Comprobante</th>
            </tr>
          </thead>
          <tbody style="padding-top: 2px;" v-if="proof !== false">
            <tr>
              <th>Tipo</th>
              <td>{{ typeProof.toLocaleUpperCase() }}</td>
            </tr>
            <tr>
              <th>Serie-Correlativo</th>
              <td>{{ proof.serie }}-{{ buildCorrelative(proof.correlative) }}</td>
            </tr>
            <tr>
              <th>Fecha y hora de emision</th>
              <td>{{ proof.dateTime }}</td>
            </tr>
            <tr>
              <td colspan="2">
                <button
                  type="button"
                  @click="showModalBaja = true"
                  :disabled="!bajaDisponible"
                  :class="{ 'is-loading': waitingBaja }"
                  class="button is-danger"
                >DAR DE BAJA LA {{ typeProof.toLocaleUpperCase() }}</button>
                <span
                  class="tag is-danger m-2"
                  v-if="!bajaDisponible"
                >LA {{ typeProof.toLocaleUpperCase() }} YA HA SIDO DADA DE BAJA</span>
              </td>
            </tr>
          </tbody>
          <tbody style="padding-top: 2px;" v-if="proof === false">
            <tr>
              <th>SIN COMPROBANTE</th>
            </tr>
          </tbody>
        </table>

        <table class="table is-narrow is-hoverable is-bordered is-striped is-fullwidth">
          <thead>
            <tr style="position:sticky;">
              <th colspan="2" style="text-align: center;">Cliente</th>
            </tr>
          </thead>
          <tbody style="padding-top: 2px;">
            <tr>
              <th>Documento</th>
              <td>{{ client.document }}</td>
            </tr>
            <tr>
              <th>Nombre</th>
              <td>{{ client.name }}</td>
            </tr>
          </tbody>
        </table>
        <table class="table is-narrow is-hoverable is-bordered is-striped is-fullwidth">
          <thead>
            <tr style="position:sticky;">
              <th colspan="5" style="text-align: center;">Productos Vendidos</th>
            </tr>
            <tr style="position:sticky;">
              <th>Codigo</th>
              <th>Nombre</th>
              <th>Precio</th>
              <th>Cantidad</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody style="padding-top: 2px;">
            <tr v-for="product of soldProducts" :key="product.id">
              <td>{{ product.code }}</td>
              <td>{{ product.name }}</td>
              <td>S/ {{ product.price }}</td>
              <td>{{ product.quantity }}</td>
              <td>S/ {{ product.mount }}</td>
            </tr>
            <tr>
              <th colspan="4" style="text-align: right">TOTAL:</th>
              <th>S/. {{ totalMount }}</th>
            </tr>
          </tbody>
        </table>
      </section>
      <footer class="modal-card-foot">
        <button
          :disabled="waitingPrint || (!bajaDisponible && typeProof !== 'ticket')"
          :class="{ 'is-loading': waitingPrint }"
          @click="print()"
          class="button is-success"
        >Imprimir copia de {{ typeProof }}</button>
        <button
          v-if="typeProof !== 'ticket'"
          :disabled="waitingSendEmail || proof.enable===0 "
          :class="{ 'is-loading': waitingSendEmail }"
          @click="showModalEmail = true"
          class="button is-success"
        >Enviar {{ typeProof }} por email</button>
        <button
          v-if="typeProof !== 'ticket'"
          :disabled="proof.enable===0 "
          @click="openPdf()"
          class="button is-success"
        >Ver pdf de la {{ typeProof }}</button>
        <button @click="emit('hide')" class="button">Cancelar</button>
      </footer>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watchEffect } from 'vue'
import { useStore } from 'vuex'
import { toast } from '@/utils/toast'
import { useRouter } from 'vue-router'

const store = useStore()

const props = defineProps({ show: Boolean, saleId: Number })
const emit = defineEmits(['save', 'hide'])

const show = ref(props.show)
const showModalBaja = ref(false)
const showModalEmail = ref(false)

const typeProof = ref('ticket')
const totalMount = ref(0)
const client = ref({} as any)
const proof = ref({} as any)
const sale = ref({} as any)
const legend = ref('')
const loadAll = ref(false)

const waitingPrint = ref(false)
const waitingBaja = ref(false)
const waitingSendEmail = ref(false)

const bajaDisponible = ref(true)
const motivoBaja = ref('ERROR EN LOS CALCULOS')
const validEmail = ref(true)

const saleId = ref(props.saleId)
const soldProducts = ref([] as any)

const router = useRouter()

watchEffect(() => {
  show.value = props.show
})

watchEffect(() => {
  validEmail.value = client.value.email !== undefined
    ? client.value.email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
    : false
})

watchEffect(async () => {
  if (props.saleId === 0) return

  loadAll.value = false
  saleId.value = props.saleId
  const dataSale = await store.dispatch('fetchSaleDetail', { id: saleId.value })
  console.log(dataSale)
  loadAll.value = true

  soldProducts.value = dataSale.data.soldProducts
  totalMount.value = dataSale.data.sale.total
  client.value = dataSale.data.client
  proof.value = dataSale.data.proof
  legend.value = dataSale.data.legend
  sale.value = dataSale.data.sale

  bajaDisponible.value = proof.value.enable === 1 && (proof.value.status === 1 || proof.value.status === 2 || proof.value.status === 4)

  typeProof.value = proof.value === false ? 'ticket' : (proof.value.serie.startsWith('B') ? 'boleta' : 'factura')
})

const renderBoucher = (legend: string, typeProof: string, sale: any, client: any, proof: any = []) => {
  let content = `
    INVERSIONES VILVER E.I.R.L - RUC 20605808931
      Jr. Grau Nro. 1032 Cajamarca-Cajabamba  `
  if (typeProof === 'ticket') {
    content += `
              TICKET DE VENTA ELECTRONICO 
      `
  } else {
    content += `
         ${typeProof.toLocaleUpperCase()} ELECTRONICA ${proof.serie}-${buildCorrelative(proof.correlative)}
      `
  }
  content += `
Fecha de emision:${typeProof !== 'ticket' ? proof.dateTime : sale.dateTime}
ID Venta: 00000${sale.id}
  `
  if (typeProof !== 'ticket') {
    content += `
CLIENTE:
Documento: ${client.document}
Nombre: ${client.name}
Direccion: ${!client.address ? '------------------' : client.address.direccion}
`
  }

  content += createTable(soldProducts.value)
  content += `
                OP.GRAVADAS:        S/ ${Math.round((sale.total * (100 / 118) + Number.EPSILON) * 10) / 10}
                   IGV(18%):        S/ ${Math.round((sale.total * (18 / 118) + Number.EPSILON) * 10) / 10}
                 DESCUENTOS:        S/ -0.00
              IMPORTE TOTAL:        S/ ${sale.total}
------------------------------------------------ 
${legend}

************************************************
            !GRACIAS POR SU COMPRA!
`

  return content
}
const buildCorrelative = (correlative: number) => {
  let zeros = ''
  for (let i = 0; i < 8 - correlative.toString().length; i++) {
    zeros += '0'
  }
  return zeros + correlative.toString()
}
const buildSpaces = (n: Number) => {
  if (n <= 0) return ''
  let spaces = ''
  for (let i = 0; i < n; i++) {
    spaces += ' '
  }
  return spaces
}

const createTable = (products: Array<any>) => {
  let firstline = ''
  let secondline = ''
  let textTable = '\n------------------------------------------------\n'
  textTable += 'PRODUCTO                 CANT P.UNI   MONTO\n'
  textTable += '------------------------------------------------\n'

  products.forEach((el: any) => {
    firstline = el.name.slice(0, 24) + buildSpaces(24 - el.name.length)
    firstline += '  '
    firstline += '' + el.quantity + buildSpaces(3 - ('' + el.quantity).length)
    firstline += ' S/'
    firstline += '' + el.price + buildSpaces(6 - ('' + el.price).length)
    firstline += ' S/'
    firstline += '' + el.mount + buildSpaces(7 - ('' + el.mount).length)
    textTable += `${firstline}\n`
    if (el.name.length > 24) {
      secondline = el.name.slice(24, 48)
      textTable += `${secondline}\n`
    }
    if (el.name.length > 48) {
      secondline =
        el.name.length > 72 ? el.name.slice(48, 72) + '...' : el.name.slice(48)
      textTable += `${secondline}\n`
    }
  })
  textTable += '------------------------------------------------\n'
  return textTable
}

const print = async () => {
  waitingPrint.value = true

  let r = renderBoucher(legend.value, typeProof.value, sale.value, client.value, proof.value)
  try {
    r = r.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    console.log(r)
    let qrContent = ''
    if (typeProof.value !== 'ticket') {
      qrContent = `20605808931|${typeProof.value === 'boleta' ? '03' : '01'}|${proof.value.serie}|${buildCorrelative(proof.value.correlative)}|${Math.round((sale.value.total * (18 / 118) + Number.EPSILON) * 10) / 10}|${sale.value.total}|${proof.value.dateTime.slice(0, 10)}|0${client.value.documentType}|${client.value.document}`
    }
    await store.dispatch('printerTicket', { text: r, qrContent })
    waitingPrint.value = false
    // emit('hide')
  } catch (error) {
    waitingPrint.value = false
    toast.danger('No se ha podido imprimir por que la impresora esta apagada o el controlador esta desactivado', 3000)
  }
}

const sendByEmail = async () => {
  if (typeProof.value === 'ticket') return
  waitingSendEmail.value = true

  try {
    const dataProof = `20605808931|${typeProof.value === 'boleta' ? '03' : '01'}|${proof.value.serie}|${buildCorrelative(proof.value.correlative)}|${Math.round((sale.value.total * (18 / 118) + Number.EPSILON) * 10) / 10}|${sale.value.total}|${proof.value.dateTime.slice(0, 10)}|0${client.value.documentType}|${client.value.document}`
    console.log(client.value.email)

    const res = await store.dispatch('sendProofByEmail', { dataProof, email: client.value.email })
    if (!res.success) {
      toast.danger(res.message, 6000)
    } else {
      toast.success(res.message, 5000)
    }
    waitingSendEmail.value = false
    showModalEmail.value = false

    // emit('hide')
  } catch (error) {
    waitingSendEmail.value = false
    toast.danger('ha ocurriod un error, no se ha podido enviar el email', 3000)
    showModalEmail.value = false
  }
}

const utf8ToBase64 = (str: string) => {
  return window.btoa(unescape(encodeURIComponent(str)))
}

const openPdf = async () => {
  if (typeProof.value === 'ticket') return
  waitingSendEmail.value = true

  const dataProof = `20605808931|${typeProof.value === 'boleta' ? '03' : '01'}|${proof.value.serie}|${buildCorrelative(proof.value.correlative)}|${Math.round((sale.value.total * (18 / 118) + Number.EPSILON) * 10) / 10}|${sale.value.total}|${proof.value.dateTime.slice(0, 10)}|0${client.value.documentType}|${client.value.document}`

  router.push('/comprobante/' + utf8ToBase64(dataProof).replaceAll('=', ''))
}

const darDeBaja = async () => {
  waitingBaja.value = true
  try {
    await store.dispatch('darBaja', { proofId: proof.value.id, typeProof: typeProof.value, motivoBaja: motivoBaja.value })
    waitingBaja.value = false
    toast.success('Comprobante Dado de baja con exito', 3000)

    bajaDisponible.value = false
    showModalBaja.value = false
  } catch (error: any) {
    waitingBaja.value = false
    toast.danger(error, 3000)
    showModalBaja.value = false
    bajaDisponible.value = true
  }
}

</script>
