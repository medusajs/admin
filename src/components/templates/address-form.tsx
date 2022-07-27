import React from "react"
import { Controller } from "react-hook-form"
import { Option } from "../../types/shared"
import { NestedForm } from "../../utils/nested-form"
import Input from "../molecules/input"
import Select from "../molecules/select"

export type AddressPayload = {
  first_name: string
  last_name: string
  company: string | null
  address_1: string
  address_2: string | null
  city: string
  province: string | null
  country_code: Option
  postal_code: string
  phone: string | null
}

type AddressFormProps = {
  form: NestedForm<AddressPayload>
  countryOptions: Option[]
  type: "shipping" | "billing" | "address"
  required?: boolean
}

const AddressForm = ({
  form,
  countryOptions,
  type,
  required = true,
}: AddressFormProps) => {
  const { register, path, control } = form

  return (
    <div>
      <span className="inter-base-semibold">General</span>
      <div className="grid grid-cols-2 gap-x-base gap-y-base mt-4 mb-8">
        <Input
          {...register(path("first_name"), {
            required: true,
          })}
          placeholder="First Name"
          label="First Name"
          required={required}
        />
        <Input
          {...form.register(path("last_name"), {
            required: true,
          })}
          placeholder="Last Name"
          label="Last Name"
          required={required}
        />
        <Input
          {...form.register(path("company"))}
          placeholder="Company"
          label="Company"
        />
        <Input
          {...form.register(path("phone"))}
          placeholder="Phone"
          label="Phone"
        />
      </div>

      <span className="inter-base-semibold">{`${
        type !== "address"
          ? `${type.charAt(0).toUpperCase()}${type.slice(1)} `
          : ""
      }Address`}</span>
      <div className="grid grid-cols-1 gap-y-base mt-4">
        <Input
          {...form.register(path("address_1"), {
            required: required,
          })}
          placeholder="Address 1"
          label="Address 1"
          required={required}
        />
        <Input
          {...form.register(path("address_2"))}
          placeholder="Address 2"
          label="Address 2"
        />
        <Input
          {...form.register(path("company"))}
          placeholder="Company"
          label="Company"
        />
        <div className="grid grid-cols-[144px_1fr] gap-x-base">
          <Input
            {...form.register(path("postal_code"), {
              required: required,
            })}
            placeholder="Postal code"
            label="Postal code"
            required={required}
            autoComplete="off"
          />
          <Input
            placeholder="City"
            label="City"
            {...form.register(path("city"), {
              required: required,
            })}
            required={required}
          />
        </div>
        <div className="grid grid-cols-2 gap-x-base">
          <Input
            {...form.register(path("province"))}
            placeholder="Province"
            label="Province"
          />
          <Controller
            control={control}
            name={path("country_code")}
            rules={{ required: required }}
            render={({ field: { value, onChange } }) => {
              return (
                <Select
                  label="Country"
                  required={required}
                  value={value}
                  options={countryOptions}
                  onChange={onChange}
                />
              )
            }}
          />
        </div>
      </div>
    </div>
  )
}
export default AddressForm
