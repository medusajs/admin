export const extractUnitPrice = (item, region, withTax = true) => {
  let itemPrice = item.unit_price

  if (itemPrice === undefined) {
    const regionPrice = item.prices.find(
      p => p.currency_code === region.currency_code
    )

    itemPrice = regionPrice.amount
  }

  if (itemPrice) {
    if (withTax) {
      return item.price * (1 + region.tax_rate)
    } else {
      return item.price
    }
  }

  return 0
}

export const displayUnitPrice = (item, region) => {
  const currCode = region.currency_code.toUpperCase()

  let price = extractUnitPrice(item, region)
  return `${(price / 100).toFixed(2)} ${currCode}`
}

export const extractOptionPrice = (price, region) => {
  let amount = price
  amount = (amount * (1 + region.tax_rate / 100)) / 100
  return `${amount} ${region.currency_code.toUpperCase()}`
}
