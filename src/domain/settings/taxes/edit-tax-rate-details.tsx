import React from "react"
import { UseFormRegister } from "react-hook-form"
import Input from "../../../components/molecules/input"
import { EditTaxRateFormData, SimpleEditFormData } from "./edit-form"

type EditTaxRateProps = {
  register:
    | UseFormRegister<EditTaxRateFormData>
    | UseFormRegister<SimpleEditFormData>
  lockName: boolean
}

export const EditTaxRateDetails = ({
  lockName,
  register,
}: EditTaxRateProps) => {
  return (
    <div>
      <p className="inter-base-semibold mb-base">Details</p>
      <Input
        disabled={lockName}
        label="Name"
        placeholder={lockName ? "Default" : "Rate name"}
        {...register("name", { required: !lockName })}
        className="mb-base min-w-[335px] w-full"
      />
      <Input
        type="number"
        min={0}
        max={100}
        step={0.01}
        label="Rate"
        placeholder="12"
        {...register("rate", { min: 0, max: 100, required: true })}
        className="mb-base min-w-[335px] w-full"
      />
      <Input
        placeholder="1000"
        label="Code"
        {...register("code", { required: true })}
        className="mb-base min-w-[335px] w-full"
      />
    </div>
  )
}
