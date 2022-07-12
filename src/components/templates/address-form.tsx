import React, { useEffect, useState } from "react"
import { countries } from "../../utils/countries"
import Input from "../molecules/input"
import Select from "../molecules/select"

const AddressForm = ({
  form = {},
  country,
  allowedCountries,
  type = "address",
}) => {
  const countryOptions = countries
    .map((c) => {
      if (allowedCountries) {
        const clean = allowedCountries.map((c) => c.toLowerCase())
        if (clean.includes(c.alpha2.toLowerCase())) {
          return { label: c.name, value: c.alpha2.toLowerCase() }
        } else {
          return null
        }
      } else {
        return { label: c.name, value: c.alpha2.toLowerCase() }
      }
    })
    .filter(Boolean)

  const [selectedCountry, setSelectedCountry] = useState(
    countryOptions.find((o) => o.value === country)
  )

  form.register(`${type}.country_code`)

  const setCountry = (value) => {
    if (value) {
      setSelectedCountry(value)
      form.setValue(`${type}.country_code`, value.value)
    }
  }

  useEffect(() => {
    if (country && !form.getValues(`${[type].country_code}`)) {
      form.setValue(`${[type].country_code}`, country)
    }
  }, [])

  return (
    <div>
      <span className="inter-base-semibold">General</span>
      <div className="grid grid-cols-2 gap-x-base gap-y-base mt-4 mb-8">
        <Input
          ref={form.register({
            required: true,
          })}
          placeholder="First Name"
          label="First Name"
          required={true}
          name={`${[type]}.first_name`}
        />
        <Input
          ref={form.register({
            required: true,
          })}
          placeholder="Last Name"
          label="Last Name"
          required={true}
          name={`${[type]}.last_name`}
        />
        <Input
          ref={form.register({
            required: true,
          })}
          placeholder="Email"
          label="Email"
          type="email"
          required={true}
          name={`email`}
        />
        <Input
          ref={form.register({
            required: true,
          })}
          placeholder="Phone"
          label="Phone"
          required={true}
          name={`${[type]}.phone`}
        />
      </div>

      <span className="inter-base-semibold">{`${
        type !== "address"
          ? `${type.charAt(0).toUpperCase()}${type.slice(1)} `
          : ""
      }Address`}</span>
      <div className="mt-4">
        <Input
          ref={form.register({
            required: true,
          })}
          placeholder="Address 1"
          label="Address 1"
          required={true}
          name={`${[type]}.address_1`}
        />
        <div className="grid grid-cols-2 gap-x-base gap-y-base mt-4">
          <Input
            ref={form.register}
            placeholder="Province"
            label="Province"
            name={`${[type]}.province`}
          />
          <Input
            ref={form.register({
              required: true,
            })}
            placeholder="Postal code"
            label="Postal code"
            required={true}
            name={`${[type]}.postal_code`}
          />
          <Input
            ref={form.register({
              required: true,
            })}
            placeholder="City"
            label="City"
            required={true}
            name={`${[type]}.city`}
          />
          <Select
            ref={form.register}
            name={`${[type]}.country_code`}
            label="Country"
            required
            value={country || null}
            options={countryOptions}
            onChange={setCountry}
            value={selectedCountry}
            defaultValue="Choose a country"
          />
        </div>
      </div>
    </div>
  )
}
export default AddressForm
