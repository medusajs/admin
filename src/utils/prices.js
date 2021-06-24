<<<<<<< HEAD
export const extractUnitPrice = (prices, region, withTax = true) => {
  let price = prices.find(ma => ma.currency_code === region.currency_code)

  if (price) {
    if (withTax) {
      return (price.amount * (1 + region.tax_rate / 100)) / 100
    } else {
      return price.amount / 100
=======
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
      return itemPrice * (1 + region.tax_rate / 100)
    } else {
      return itemPrice
>>>>>>> master
    }
  }

  return 0
}

export const displayUnitPrice = (item, region) => {
  const currCode = region.currency_code.toUpperCase()

<<<<<<< HEAD
  if (item.unit_price) {
    let tempPrices = [
      { amount: item.unit_price, currency_code: region.currency_code },
    ]

    return `${extractUnitPrice(tempPrices, region).toFixed(2)} ${currCode}`
  } else {
    return `${extractUnitPrice(item.prices, region).toFixed(2)} ${currCode}`
  }
=======
  let price = extractUnitPrice(item, region)
  return `${(price / 100).toFixed(2)} ${currCode}`
>>>>>>> master
}

export const extractOptionPrice = (price, region) => {
  let amount = price
  amount = (amount * (1 + region.tax_rate / 100)) / 100
  return `${amount} ${region.currency_code.toUpperCase()}`
}
