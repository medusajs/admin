import React from "react"
import { useFieldArray } from "react-hook-form"
import { useProductForm } from "../../../form/product-form-context"

const VariantsTable = () => {
  const { control, register } = useProductForm()

  const { fields } = useFieldArray({
    control,
    name: "variants",
  })

  return (
    <div>
      <div></div>
    </div>
  )
}

export default VariantsTable
