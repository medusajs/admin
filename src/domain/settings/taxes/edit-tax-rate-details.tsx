import React from "react"
import LockIcon from "../../../components/fundamentals/icons/lock-icon"
import Input from "../../../components/molecules/input"
import FormValidator from "../../../utils/form-validator"
import { NestedForm } from "../../../utils/nested-form"

export type EditTaxRateFormType = {
  name: string
  rate: number
  code: string
}

type EditTaxRateProps = {
  form: NestedForm<EditTaxRateFormType>
  lockName?: boolean
}

export const EditTaxRateDetails = ({
  lockName = false,
  form,
}: EditTaxRateProps) => {
  const {
    register,
    path,
    formState: { errors },
  } = form

  return (
    <div>
      <p className="inter-base-semibold mb-base">Details</p>
      <Input
        disabled={lockName}
        label="Name"
        prefix={
          lockName ? <LockIcon size={16} className="text-grey-40" /> : undefined
        }
        placeholder={lockName ? "Default" : "Rate name"}
        {...register(path("name"), {
          required: !lockName ? FormValidator.required("Name") : undefined,
        })}
        required={!lockName}
        className="mb-base min-w-[335px] w-full"
        errors={errors}
      />
      <Input
        type="number"
        min={0}
        max={100}
        step={1}
        label="Rate"
        placeholder="12"
        {...register(path("rate"), {
          min: FormValidator.min("Rate", 0),
          max: FormValidator.max("Rate", 100),
          required: FormValidator.required("Rate"),
          valueAsNumber: true,
        })}
        required
        className="mb-base min-w-[335px] w-full"
        errors={errors}
      />
      <Input
        placeholder="1000"
        label="Code"
        {...register(path("code"), {
          required: FormValidator.required("Code"),
        })}
        required
        className="mb-base min-w-[335px] w-full"
        errors={errors}
      />
    </div>
  )
}
