import React from "react"
import { Controller } from "react-hook-form"
import InputField from "../../../../../components/molecules/input"
import { NextSelect } from "../../../../../components/molecules/select/next-select"
import { Option } from "../../../../../types/shared"
import FormValidator from "../../../../../utils/form-validator"
import { NestedForm } from "../../../../../utils/nested-form"
import { useStoreData } from "./use-store-data"

export type RegionDetailsFormType = {
  name: string
  countries: Option[]
  currency_code: Option
  tax_rate: number | null
  tax_code: string | null
}

type Props = {
  isCreate?: boolean
  form: NestedForm<RegionDetailsFormType>
}

const RegionDetailsForm = ({ form, isCreate = false }: Props) => {
  const { control, register, path } = form
  const { currencyOptions, countryOptions } = useStoreData()

  return (
    <div>
      <div className="grid grid-cols-2 gap-large">
        <InputField
          label="Title"
          required
          {...register(path("name"), {
            required: "Title is required",
            minLength: FormValidator.minOneCharRule("Title"),
            pattern: FormValidator.whiteSpaceRule("Title"),
          })}
        />
        <Controller
          control={control}
          name={path("currency_code")}
          rules={{
            required: "Currency code is required",
          }}
          render={({ field }) => {
            return (
              <NextSelect
                label="Currency"
                required
                {...field}
                options={currencyOptions}
              />
            )
          }}
        />
        {isCreate && (
          <>
            <InputField
              label="Tax Rate"
              required
              type={"number"}
              {...register(path("tax_rate"), {
                required: isCreate ? "Tax rate is required" : undefined,
                min: isCreate
                  ? FormValidator.nonNegativeNumberRule("Tax rate")
                  : undefined,
                valueAsNumber: true,
              })}
            />
            <InputField label="Tax Code" {...register(path("tax_code"))} />
          </>
        )}
        <Controller
          control={control}
          name={path("countries")}
          render={({ field }) => {
            return (
              <NextSelect
                label="Countries"
                isMulti
                selectAll
                {...field}
                options={countryOptions}
              />
            )
          }}
        />
      </div>
    </div>
  )
}

export default RegionDetailsForm
