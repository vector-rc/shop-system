export type Currency ={name:string, ISOCode:string, symbol:string, sale?:string, buy?:string}

export const currencies:Array<Currency> = [
  {
    name: 'SOLES',
    ISOCode: 'PEN',
    symbol: 'S/.',
    sale: '', // venta
    buy: ''
  },
  {
    name: 'DOLARES AMERICANOS',
    ISOCode: 'USD',
    symbol: '$',
    sale: 'https://estadisticas.bcrp.gob.pe/estadisticas/series/api/PD04640PD/json/2022-06-14', // venta
    buy: 'https://estadisticas.bcrp.gob.pe/estadisticas/series/api/PD04639PD/json/2022-06-14'// compra
  },
  {
    name: 'EUROS',
    ISOCode: 'EUR',
    symbol: '€',
    sale: 'https://estadisticas.bcrp.gob.pe/estadisticas/series/api/PD04648PD/json/2022-06-14', // venta
    buy: 'https://estadisticas.bcrp.gob.pe/estadisticas/series/api/PD04647PD/json/2022-06-14'// compra
  }
]

export const getCurrencySymbolByIso = (isoCode:string):string => {
  const currency = currencies.find(c => c.ISOCode === isoCode)
  return currency ? currency.symbol : 'S/.'
}
