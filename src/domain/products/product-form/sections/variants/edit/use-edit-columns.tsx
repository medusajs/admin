import { MoneyAmount, Product } from "@medusajs/medusa"
import { ProductVariantOption } from "@medusajs/medusa/dist/types/product-variant"

export type Column = {
  header: string
  field: string
  formatter?: Function
}

export const useEditColumns = (product: Product): Column[] => {
  const defaultFields = [
    { header: "Title", field: "title" },
    { header: "SKU", field: "sku" },
    { header: "EAN", field: "ean" },
    { header: "Inventory", field: "inventory_quantity" },
  ]

  const optionColumns = product.options.map((o) => ({
    header: o.title,
    field: "options",
    formatter: (variantOptions: ProductVariantOption[]) => {
      const displayVal = variantOptions.find((val) => val.option_id === o.id)
      return displayVal?.value || " - "
    },
  }))

  return [
    ...optionColumns,
    {
      header: "Prices",
      field: "prices",
      formatter: (prices: MoneyAmount[]) => `${prices?.length ?? 0} price(s)`,
    },
    ...defaultFields,
  ]
}
