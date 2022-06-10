import { round } from './roundDecimal'
import { getCurrencySymbolByIso } from '@/utils/currencies'

const buildSpaces = (n: Number) => {
  if (n <= 0) return ''
  let spaces = ''
  for (let i = 0; i < n; i++) {
    spaces += ' '
  }
  return spaces
}

const createTable = (products: Array<any>, currency:string) => {
  let firstline = ''
  let secondline = ''
  let textTable = '\n------------------------------------------------\n'
  textTable += 'PRODUCTO                 CANT P.UNI   MONTO\n'
  textTable += '------------------------------------------------\n'

  products.forEach((el: any) => {
    if (!el.price) el.price = el.priceSale

    firstline = el.name.slice(0, 24) + buildSpaces(24 - el.name.length)
    firstline += '  '
    firstline += '' + el.quantity + buildSpaces(3 - ('' + el.quantity).length)
    firstline += ` ${getCurrencySymbolByIso(currency)}`
    firstline += '' + el.price + buildSpaces(6 - ('' + el.price).length)
    firstline += ` ${getCurrencySymbolByIso(currency)}`
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

export const buildCorrelative = (correlative: number) => {
  let zeros = ''
  for (let i = 0; i < 8 - correlative.toString().length; i++) {
    zeros += '0'
  }
  return zeros + correlative.toString()
}

export const renderBoucher = (legend: string, typeProof: string, sale: any, client: any, proof: any = [], soldProducts:Array<any>) => {
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

  content += createTable(soldProducts, sale.currencyType)
  content += `
                OP.GRAVADAS:        ${getCurrencySymbolByIso(sale.currencyType)} ${round(sale.total * (100 / 118), 2)}
                   IGV(18%):        ${getCurrencySymbolByIso(sale.currencyType)} ${round(sale.total * (18 / 118), 2)}
                 DESCUENTOS:        ${getCurrencySymbolByIso(sale.currencyType)} -0.00
              IMPORTE TOTAL:        ${getCurrencySymbolByIso(sale.currencyType)} ${sale.total}
------------------------------------------------ 
${legend}

************************************************
            !GRACIAS POR SU COMPRA!
`

  return content
}

export const previewPrinter = (renderedProof:string) => {
  return `
  <html>
  <head>
  <link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@300&display=swap" rel="stylesheet">
   <style>
  pre{
    font-family: 'Roboto Mono', monospace;
    font-weight: bold;
    padding:1rem;
    width:460px
    
  }
  </style></head>
  <body>
 
  <pre >
      ${renderedProof}
  </pre>
  </body>
  </html>
  `
}

// const print = async () => {
//   waitingPrint.value = true

//   let r = renderBoucher(legend.value, typeProof.value, sale.value, client.value, proof.value, soldProducts.value)
//   try {
//     r = r.normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
//     console.log(r)
//     let qrContent = ''
//     if (typeProof.value !== 'ticket') {
//       qrContent = `20605808931|${typeProof.value === 'boleta' ? '03' : '01'}|${proof.value.serie}|${buildCorrelative(proof.value.correlative)}|${Math.round((sale.value.total * (18 / 118) + Number.EPSILON) * 10) / 10}|${sale.value.total}|${proof.value.dateTime.slice(0, 10)}|0${client.value.documentType}|${client.value.document}`
//     }
//     await store.dispatch('printerTicket', { text: r, qrContent })
//     waitingPrint.value = false
//     // emit('hide')
//   } catch (error) {
//     waitingPrint.value = false
//     toast.danger('No se ha podido imprimir por que la impresora esta apagada o el controlador esta desactivado', 3000)
//   }
// }
