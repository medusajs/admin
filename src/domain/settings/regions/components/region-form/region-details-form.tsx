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
  const {
    control,
    register,
    path,
    formState: { errors },
  } = form
  const { currencyOptions, countryOptions } = useStoreData()

  return (
    <div>
      <div className="grid grid-cols-2 gap-large">
        <InputField
          label="Title"
          placeholder="Europe..."
          required
          {...register(path("name"), {
            required: "Title is required",
            minLength: FormValidator.minOneCharRule("Title"),
            pattern: FormValidator.whiteSpaceRule("Title"),
          })}
          errors={errors}
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
                placeholder="Choose currency..."
                required
                {...field}
                options={currencyOptions}
                name={path("currency_code")}
                errors={errors}
              />
            )
          }}
        />
        {isCreate && (
          <>
            <InputField
              label="Tax Rate"
              required
              placeholder="0.25..."
              step={0.01}
              type={"number"}
              {...register(path("tax_rate"), {
                required: isCreate ? "Tax rate is required" : undefined,
                min: isCreate
                  ? FormValidator.nonNegativeNumberRule("Tax rate")
                  : undefined,
                max: isCreate
                  ? {
                      value: 1,
                      message: "Tax rate must be equal or less than 1",
                    }
                  : undefined,
                valueAsNumber: true,
              })}
              errors={errors}
            />
            <InputField
              label="Tax Code"
              placeholder="1000..."
              {...register(path("tax_code"))}
              errors={errors}
            />
          </>
        )}
        <Controller
          control={control}
          name={path("countries")}
          render={({ field }) => {
            return (
              <NextSelect
                label="Countries"
                placeholder="Choose countries..."
                isMulti
                selectAll
                {...field}
                name={path("countries")}
                errors={errors}
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
