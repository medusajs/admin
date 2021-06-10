export const extractUnitPrice = (prices, region, withTax = true) => {
  let price = prices.find(ma => ma.currency_code === region.currency_code)

  if (price) {
    if (withTax) {
      return (price.amount * (1 + region.tax_rate / 100)) / 100
    } else {
      return price.amount / 100
    }
  }

  return 0
}

export const displayUnitPrice = (item, region) => {
  const currCode = region.currency_code.toUpperCase()

  if (item.unit_price) {
    let tempPrices = [
      { amount: item.unit_price, currency_code: region.currency_code },
    ]

    return `${extractUnitPrice(tempPrices, region).toFixed(2)} ${currCode}`
  } else {
    return `${extractUnitPrice(item.prices, region).toFixed(2)} ${currCode}`
  }
}

export const extractOptionPrice = (price, region) => {
  let amount = price
  amount = (amount * (1 + region.tax_rate / 100)) / 100
  return `${amount} ${region.currency_code.toUpperCase()}`
}
