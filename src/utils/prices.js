const noDivisionCurrencies = ["krw"]

export function normalizeAmount(currency, amount) {
  let divisor = 100
  if (noDivisionCurrencies.includes(currency.toLowerCase())) {
    divisor = 1
  }

  return Math.floor(amount) / divisor
}

export function displayAmount(currency, amount, decimals = 2) {
  if (noDivisionCurrencies.includes(currency.toLowerCase())) {
    return normalizeAmount(currency, amount)
  }

  const normalizedAmount = normalizeAmount(currency, amount)

  return normalizedAmount.toFixed(decimals)
}

export const extractUnitPrice = (item, region, withTax = true) => {
  let itemPrice = item.unit_price

  if (itemPrice === undefined) {
    const regionPrice = item.prices.find(
      (p) => p.currency_code === region.currency_code
    )

    itemPrice = regionPrice.amount
  }

  if (itemPrice) {
    if (withTax) {
      return itemPrice * (1 + region.tax_rate / 100)
    } else {
      return itemPrice
    }
  }

  return 0
}

export const displayUnitPrice = (item, region) => {
  const currCode = region.currency_code.toUpperCase()

  const price = extractUnitPrice(item, region)
  return `${displayAmount(currCode, price)} ${currCode}`
}

export const extractOptionPrice = (price, region) => {
  let amount = price
  amount = (amount * (1 + region.tax_rate / 100)) / 100
  return `${amount} ${region.currency_code.toUpperCase()}`
}

export function persistedPrice(currency, amount) {
  let multiplier = 100
  if (noDivisionCurrencies.includes(currency.toLowerCase())) {
    multiplier = 1
  }

  return Math.floor(amount) * multiplier
}

export const stringDisplayPrice = ({ amount, currencyCode }) => {
  if (!amount || !currencyCode) {
    return `N/A`
  }

  const display = displayAmount(currencyCode, amount, 2)
  return `${display} ${currencyCode.toUpperCase()}`
}
