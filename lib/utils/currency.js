// Formateo de moneda
export const currencies = {
  DOP: { symbol: 'RD$', name: 'Peso Dominicano' },
  USD: { symbol: '$', name: 'Dólar' },
}

export const formatCurrency = (amount, currencyCode = 'DOP') => {
  const currency = currencies[currencyCode] || currencies.DOP
  const formatted = new Intl.NumberFormat('es-DO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount)
  
  return `${currency.symbol}${formatted}`
}

export const convertCurrency = (amount, from, to) => {
  // Tasa de cambio DOP a USD (aproximada, deberías usar una API en producción)
  const exchangeRates = {
    DOP_USD: 0.017,
    USD_DOP: 58.5,
  }
  
  if (from === to) return amount
  
  const rateKey = `${from}_${to}`
  const rate = exchangeRates[rateKey] || 1
  
  return amount * rate
}
