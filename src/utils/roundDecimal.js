export const round = (number, presicion) => {
  if (isNaN(Number(number))) return 0
  if (!number) return 0
  return Math.round((number + Number.EPSILON) * Math.pow(10, presicion)) / Math.pow(10, presicion)
}
