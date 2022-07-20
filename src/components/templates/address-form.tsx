import React from "react"
import { Controller } from "react-hook-form"
import { Option } from "../../types/shared"
import { NestedForm } from "../../utils/nested-form"
import Input from "../molecules/input"
import Select from "../molecules/select"

export interface AddressPayload {
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
}

const AddressForm = ({ form, countryOptions, type }: AddressFormProps) => {
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
          required={true}
        />
        <Input
          {...form.register(path("last_name"), {
            required: true,
          })}
          placeholder="Last Name"
          label="Last Name"
          required={true}
        />
        <Input
          {...form.register(path("phone"), {
            required: true,
          })}
          placeholder="Phone"
          label="Phone"
          required={true}
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
            required: true,
          })}
          placeholder="Address 1"
          label="Address 1"
          required={true}
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
              required: true,
            })}
            placeholder="Postal code"
            label="Postal code"
            required={true}
            autoComplete="off"
          />
          <Input
            placeholder="City"
            label="City"
            {...form.register(path("city"), {
              required: true,
            })}
            required
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
            render={({ field: { value, onChange } }) => {
              return (
                <Select
                  label="Country"
                  required
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
