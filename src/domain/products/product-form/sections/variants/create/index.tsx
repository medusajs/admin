import React from "react"
import { useFieldArray } from "react-hook-form"
import InputField from "../../../../../../components/molecules/input"
import { useProductForm } from "../../../form/product-form-context"
import ProductOptions from "./product-options"

const CreateVariants = () => {
  const { control, register } = useProductForm()

  const { fields, append, remove } = useFieldArray({
    control,
    name: "variants",
  })

  return (
    <div>
      <ProductOptions createVariant={append} deleteVariant={remove} />
      {fields.map((v, i) => {
        return (
          <div key={v.id}>
            <InputField
              {...register(`variants.${i}.title`)}
              defaultValue={v.title ?? undefined}
            />
            {v.options?.map((o, j) => {
              return (
                <div key={j}>
                  <span>value {o.value}</span>
                  <input
                    type="hidden"
                    name={`variants[${i}].options[${j}].value`}
                    defaultValue={o.value}
                  />
                </div>
              )
            })}
          </div>
        )
      })}
    </div>
  )
}

export default CreateVariants
