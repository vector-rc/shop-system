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
    firstline += '' + el.priceSale + buildSpaces(6 - ('' + el.priceSale).length)
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

const buildCorrelative = (correlative: number) => {
  let zeros = ''
  for (let i = 0; i < 8 - correlative.toString().length; i++) {
    zeros += '0'
  }
  return zeros + correlative.toString()
}

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

  content += createTable(itemsCart.value)
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

const previewPrinter = (proof) => {
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
      ${proof}
  </pre>
  </body>
  </html>
  `
}
