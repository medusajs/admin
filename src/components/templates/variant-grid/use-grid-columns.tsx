import { capitalize } from "lodash"

export const useGridColumns = (product, isEditing) => {
  const defaultFields = [
    { header: "Title", field: "title" },
    { header: "SKU", field: "sku" },
    { header: "EAN", field: "ean" },
    { header: "Inventory", field: "inventory_quantity" },
  ]

  if (isEditing) {
    const optionColumns = product.options.map((o) => ({
      header: o.title,
      field: "options",
      formatter: (variantOptions) => {
        const displayVal = variantOptions.find((val) => val.option_id === o.id)
        return displayVal?.value || " - "
      },
    }))

    return [
      ...optionColumns,
      {
        header: "Prices",
        field: "prices",
        formatter: (prices) => `${prices.length} price(s)`,
      },
      ...defaultFields,
    ]
  } else {
    return [
      {
        header: "Variant",
        field: "options",
        formatter: (value) => {
          const options = value.map((v) => {
            if (v.value) {
              return capitalize(v.value)
            }
            return capitalize(v)
          })

          return options.join(" / ")
        },
        readOnly: true,
        headCol: true,
      },
      ...defaultFields,
    ]
  }
}
