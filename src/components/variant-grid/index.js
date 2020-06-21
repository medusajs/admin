import React from "react"

const VariantGrid = ({ variants }) => {
  const settings = {
    data: [["", "Title", "SKU", "Barcode"], ...variants],
    columns: [
      {
        renderer: (instance, td, row, col, prop, value, cellProperties) => {
          td.innerHTML = value.join(" / ")
        },
      },
    ],
  }

  return <HotTable colHeaders={true} rowHeaders={true} />
}
