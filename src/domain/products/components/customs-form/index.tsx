import React from "react"
import { Controller } from "react-hook-form"
import InputField from "../../../../components/molecules/input"
import Select from "../../../../components/molecules/select"
import { Option } from "../../../../types/shared"
import { countries } from "../../../../utils/countries"
import FormValidator from "../../../../utils/form-validator"
import { NestedForm } from "../../../../utils/nested-form"

export type CustomsPayload = {
  mid_code: string | null
  hs_code: string | null
  origin_country: Option | null
}

type CustomsFormProps = {
  form: NestedForm<CustomsPayload>
}

const CustomsForm = ({ form }: CustomsFormProps) => {
  const {
    register,
    path,
    control,
    formState: { errors },
  } = form

  const countryOptions = countries.map((c) => ({
    label: c.name,
    value: c.alpha2,
  }))

  return (
    <div className="grid grid-cols-2 gap-large">
      <InputField
        label="MID Code"
        placeholder="XDSKLAD9999..."
        {...register(path("mid_code"), {
          pattern: FormValidator.whiteSpaceRule("MID Code"),
        })}
        errors={errors}
      />
      <InputField
        label="HS Code"
        placeholder="BDJSK39277W..."
        {...register(path("hs_code"), {
          pattern: FormValidator.whiteSpaceRule("HS Code"),
        })}
        errors={errors}
      />
      <Controller
        name={path("origin_country")}
        control={control}
        render={({ field }) => {
          return (
            <Select
              label="Country of origin"
              placeholder="Select country..."
              options={countryOptions}
              enableSearch
              {...field}
            />
          )
        }}
      />
    </div>
  )
}

export default CustomsForm
