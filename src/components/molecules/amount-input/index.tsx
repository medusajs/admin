import React from "react"
import InputError from "../../atoms/input-error"
import InputHeader from "../../fundamentals/input-header"
import { NextSelect } from "../select/next-select"

type Props = {
  label?: string
  errors?: Record<string, unknown>
  name?: string
}

const AmountInput = ({ label, errors, name }: Props) => {
  return (
    <div className="flex flex-col gap-y-xsmall">
      {label && <InputHeader label={label} />}
      <div className="grid grid-cols-[88px_1fr] bg-grey-5 rounded-rounded border border-grey-20">
        <div className="border-r border-grey-20">
          <NextSelect
            customStyles={{
              control: "border-none",
            }}
          />
        </div>
        <input type="number" className="bg-transparent" />
      </div>
      <InputError errors={errors} name={name} />
    </div>
  )
}

export default AmountInput
