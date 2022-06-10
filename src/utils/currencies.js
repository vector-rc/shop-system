export const currencies = [
  {
    currency: 'SOLES',
    ISOCode: 'PEN',
    symbol: 'S/.'
  },
  {
    currency: 'DOLARES AMERICANOS',
    ISOCode: 'USD',
    symbol: '$'
  },
  {
    currency: 'EUROS',
    ISOCode: 'EUR',
    symbol: '€'
  }
]

export const getCurrencySymbolByIso = (isoCode) => {
  return currencies.find(c => c.ISOCode === isoCode).symbol
}
