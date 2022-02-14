import { Printer, USB } from 'escpos'
// install escpos-usb adapter module manually
// import escposUSB from 'escpos-usb'
// Select the adapter based on your printer type

export const printerSample = () => {
  const device = new USB()
  // const device  = new escpos.Network('localhost');
  // const device  = new escpos.Serial('/dev/usb/lp0');

  const options = { encoding: 'GB18030' /* default */ }
  // encoding is optional

  const printer = new Printer(device, options)

  printer
    .font('a')
    .align('ct')
    .style('bu')
    .size(1, 1)
    .text('The quick brown fox jumps over the lazy dog')
    .text('敏捷的棕色狐狸跳过懒狗')
    .barcode('1234567', 'EAN8')
    .table(['One', 'Two', 'Three'])
    .tableCustom(
      [
        { text: 'Left', align: 'LEFT', width: 0.33, style: 'B' },
        { text: 'Center', align: 'CENTER', width: 0.33 },
        { text: 'Right', align: 'RIGHT', width: 0.33 }
      ],
      { encoding: 'cp857', size: [1, 1] } // Optional
    )
    .qrimage('https://github.com/song940/node-escpos', function () {
      this.cut()
      this.close()
    })
}
