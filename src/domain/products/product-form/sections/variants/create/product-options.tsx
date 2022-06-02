import React from "react"
import { Controller, useFieldArray } from "react-hook-form"
import Button from "../../../../../../components/fundamentals/button"
import TrashIcon from "../../../../../../components/fundamentals/icons/trash-icon"
import {
  default as Input,
  default as InputField,
} from "../../../../../../components/molecules/input"
import TagInput from "../../../../../../components/molecules/tag-input"
import { useProductForm } from "../../../form/product-form-context"
import { ProductOption, VariantFormValues } from "../../../utils/types"

const ProductOptions = () => {
  const { control, register, getValues } = useProductForm()

  const { fields, append, remove } = useFieldArray({
    control,
    name: "options",
  })

  const {
    fields: vars,
    append: createVariant,
    remove: deleteVariant,
  } = useFieldArray<VariantFormValues>({
    control,
    name: "variants",
  })

  const detectChange = () => {
    const { options, variants } = getValues()

    console.log("vars", vars)

    if (!options) {
      return
    }

    const combinations = getNewCombinations(options, variants)

    const newVariants: VariantFormValues[] = combinations.map((c) => {
      return {
        title: c.join(" / "),
        ean: null,
        sku: null,
        inventory_quantity: null,
        options: c.map((o) => ({ value: o })),
      }
    })

    createVariant(newVariants, false)
  }

  return (
    <div>
      <div className="flex items-center mb-base">
        <h6 className="inter-base-semibold text-grey-90 mr-1.5">
          Product Options
        </h6>
      </div>
      <div className="flex flex-col gap-y-base max-w-[570px] w-full mb-4">
        {fields.map((o, index) => (
          <div key={o.id} className="flex items-center">
            <div className="flex gap-x-2xsmall grow">
              <Input
                required
                className="w-[144px]"
                name={`options[${index}].name`}
                ref={register()}
                label="Option title"
                placeholder="Color, Size..."
              />
              <Controller
                name={`options[${index}].values`}
                control={control}
                defaultValue={o?.values || []}
                render={({ onChange, value }) => {
                  return (
                    <TagInput
                      className="grow"
                      placeholder="Blue, Green..."
                      values={value}
                      onChange={(e) => {
                        onChange(e)
                        detectChange()
                      }}
                    />
                  )
                }}
              />
            </div>
            <Button
              variant="ghost"
              size="small"
              className="ml-base"
              onClick={() => remove(index)}
            >
              <TrashIcon className="text-grey-40" size={20} />
            </Button>
          </div>
        ))}
        <div className="mt-xs">
          <Button onClick={append} size="small" variant="ghost">
            + Add an option
          </Button>
        </div>
      </div>
      {vars.map((v, i) => {
        console.log(vars)
        return (
          <div key={v.id}>
            <InputField
              name={`variants[${i}].title`}
              ref={register()}
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

const getNewCombinations = (
  options: ProductOption[],
  variants: VariantFormValues[]
) => {
  const combinations: string[][] = []

  const getCombination = (options: ProductOption[], current: string[]) => {
    if (options.length === 0) {
      combinations.push(current)
    } else {
      const [head, ...tail] = options
      for (const value of head.values) {
        getCombination(tail, [...current, value])
      }
    }
  }

  getCombination(options, [])

  const existingCombinations = variants?.map((v) => {
    return v.options?.map((v) => v.value)
  })

  if (!existingCombinations?.length) {
    return combinations
  }

  const filterExisting = (arr: string[][], farr: string[]) => {
    if (JSON.stringify(arr).includes(JSON.stringify(farr))) {
      return false
    }
  }

  const newCombinations = combinations.filter((c) =>
    filterExisting(existingCombinations, c)
  )

  return newCombinations
}

export default ProductOptions
