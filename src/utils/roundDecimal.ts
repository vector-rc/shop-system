export const round = (number:number, presicion:number):number => {
  if (!presicion) return 0
  if (isNaN(Number(number))) return 0
  if (!number) return 0
  return Math.round((number + Number.EPSILON) * Math.pow(10, presicion)) / Math.pow(10, presicion)
}
