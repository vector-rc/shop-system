import * as JSPM from 'jsprintmanager'

const $ = (query) => document.querySelector(query)

JSPM.JSPrintManager.auto_reconnect = true
JSPM.JSPrintManager.start()
JSPM.JSPrintManager.WS.onStatusChanged = function () {
  if (jspmWSStatus()) {
    // get client installed printers
    JSPM.JSPrintManager.getPrinters().then(function (myPrinters) {
      let options = ''
      for (let i = 0; i < myPrinters.length; i++) {
        options += '<option>' + myPrinters[i] + '</option>'
      }
      $('#installedPrinterName').html(options)
    })
  }
}

// Check JSPM WebSocket status
function jspmWSStatus () {
  if (JSPM.JSPrintManager.websocket_status === JSPM.WSStatus.Open) { return true } else if (JSPM.JSPrintManager.websocket_status === JSPM.WSStatus.Closed) {
    alert('JSPrintManager (JSPM) is not installed or not running! Download JSPM Client App from https://neodynamic.com/downloads/jspm')
    return false
  } else if (JSPM.JSPrintManager.websocket_status === JSPM.WSStatus.Blocked) {
    alert('JSPM has blocked this website!')
    return false
  }
}

// Do printing...
export function print (o) {
  if (jspmWSStatus()) {
    // Create a ClientPrintJob
    const cpj = new JSPM.ClientPrintJob()
    // Set Printer type (Refer to the help, there many of them!)
    if ($('#useDefaultPrinter').prop('checked')) {
      cpj.clientPrinter = new JSPM.DefaultPrinter()
    } else {
      cpj.clientPrinter = new JSPM.InstalledPrinter($('#installedPrinterName').val())
    }
    // Set content to print...
    // Create ESP/POS commands for sample label
    const esc = '\x1B' // ESC byte in hex notation
    const newLine = '\x0A' // LF byte in hex notation

    let cmds = esc + '@' // Initializes the printer (ESC @)
    cmds += esc + '!' + '\x38' // Emphasized + Double-height + Double-width mode selected (ESC ! (8 + 16 + 32)) 56 dec => 38 hex
    cmds += 'BEST DEAL STORES' // text to print
    cmds += newLine + newLine
    cmds += esc + '!' + '\x00' // Character font A selected (ESC ! 0)
    cmds += 'COOKIES                   5.00'
    cmds += newLine
    cmds += 'MILK 65 Fl oz             3.78'
    cmds += newLine + newLine
    cmds += 'SUBTOTAL                  8.78'
    cmds += newLine
    cmds += 'TAX 5%                    0.44'
    cmds += newLine
    cmds += 'TOTAL                     9.22'
    cmds += newLine
    cmds += 'CASH TEND                10.00'
    cmds += newLine
    cmds += 'CASH DUE                  0.78'
    cmds += newLine + newLine
    cmds += esc + '!' + '\x18' // Emphasized + Double-height mode selected (ESC ! (16 + 8)) 24 dec => 18 hex
    cmds += '# ITEMS SOLD 2'
    cmds += esc + '!' + '\x00' // Character font A selected (ESC ! 0)
    cmds += newLine + newLine
    cmds += '11/03/13  19:53:17'

    cpj.printerCommands = cmds
    // Send print job to printer!
    cpj.sendToClient()
  }
}
