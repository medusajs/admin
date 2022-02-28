import React from "react"
import Input from "../../../components/molecules/input"

export const EditTaxRateDetails = ({ lockName, register }) => {
  return (
    <div>
      <p className="inter-base-semibold mb-base">Details</p>
      <Input
        disabled={lockName}
        name="name"
        label="Name"
        placeholder={lockName ? "Default" : "Rate name"}
        ref={register({ required: !lockName })}
        className="mb-base min-w-[335px] w-full"
      />
      <Input
        type="number"
        min={0}
        max={100}
        step={0.01}
        name="rate"
        label="Rate"
        placeholder="12"
        ref={register({ min: 0, max: 100, required: true })}
        className="mb-base min-w-[335px] w-full"
      />
      <Input
        placeholder="1000"
        name="code"
        label="Code"
        ref={register({ required: true })}
        className="mb-base min-w-[335px] w-full"
      />
    </div>
  )
}
