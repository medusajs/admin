import { Discount } from "@medusajs/medusa"

export const discountToFormValuesMapper = (discount: Discount) => {
  return {
    ...discount,
  }
}

export const formValuesToCreateDiscountMapper = (values) => {
  return {}
}

export const formValuesToUpdateDiscountMapper = (values) => {
  return {}
}
