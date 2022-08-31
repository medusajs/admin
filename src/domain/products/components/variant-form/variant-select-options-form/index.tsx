import React from "react"
import { Controller, useFieldArray } from "react-hook-form"
import { NextCreateableSelect } from "../../../../../components/molecules/select/next-select"
import { NestedForm } from "../../../../../utils/nested-form"

export type VariantOptionValueType = {
  option_id: string
  value: string
  label: string
  isDisabled?: boolean
}

export type VariantOptionType = {
  id: string
  title: string
  value: VariantOptionValueType | null
}

export type VariantOptionsFormType = {
  variant_options: VariantOptionType[]
}

type Props = {
  form: NestedForm<VariantOptionsFormType>
  options: VariantOptionValueType[]
  onCreateOption: (option: VariantOptionValueType) => void
}

const VariantOptionsForm = ({ form, options, onCreateOption }: Props) => {
  const { control, path } = form

  const { fields } = useFieldArray({
    control: form.control,
    name: path("variant_options"),
    keyName: "fieldId",
  })

  return (
    <div className="grid grid-cols-2 gap-large pb-2xsmall">
      {fields.map((field, index) => {
        return (
          <Controller
            key={field.fieldId}
            control={control}
            name={path(`variant_options.${index}.value`)}
            render={({ field: { value, onChange, onBlur, ref } }) => {
              return (
                <NextCreateableSelect
                  ref={ref}
                  value={value}
                  onChange={onChange}
                  onBlur={onBlur}
                  label={field.title}
                  required
                  options={
                    options.filter((o) => o.option_id === field.id) || []
                  }
                  onCreateOption={(value) => {
                    const newOption = {
                      option_id: field.id,
                      value: value,
                      label: value,
                    }

                    onCreateOption(newOption)

                    onChange(newOption)
                  }}
                />
              )
            }}
          />
        )
      })}
    </div>
  )
}

export default VariantOptionsForm
