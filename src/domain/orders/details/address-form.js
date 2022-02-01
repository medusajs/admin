import React, { useEffect, useState } from "react"
import { isEmpty } from "lodash"

import Select from "../../../components/molecules/select"
import Input from "../../../components/molecules/input"

import { countries } from "../../../utils/countries"

const AddressForm = ({ form = {}, country, address, allowedCountries }) => {
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
    countryOptions.find((o) =>
      isEmpty(address) ? o.value === country : o.value === address.country_code
    )
  )

  form.register("address.country_code")

  console.log(country, countryOptions, address)

  const setCountry = (value) => {
    setSelectedCountry(value)
    form.setValue("address.country_code", value.value)
  }

  useEffect(() => {
    if (!isEmpty(address)) {
      form.reset({ address: { ...address } })
    } else if (country) {
      form.setValue("address.country_code", country)
    }
  }, [])

  return (
    <div>
      <div>
        <div>
          <span className="inter-base-semibold">General</span>

          <div className="grid grid-cols-2 gap-x-base gap-y-base">
            <Input
              ref={form.register({
                required: true,
              })}
              placeholder="First Name"
              label="First Name"
              required={true}
              name="address.first_name"
            />
            <Input
              ref={form.register({
                required: true,
              })}
              placeholder="Last Name"
              label="Last Name"
              required={true}
              name="address.last_name"
            />
            <Input
              mb={2}
              ref={form.register({
                required: true,
              })}
              placeholder="Phone"
              label="Phone"
              required={true}
              name="address.phone"
            />
          </div>
        </div>
        <div className="mt-8">
          <span className="inter-base-semibold">Shipping Address</span>
          <div className="grid gap-y-base my-4">
            <Input
              ref={form.register({
                required: true,
              })}
              placeholder="Address 1"
              label="Address 1"
              required={true}
              name="address.address_1"
            />
            <Input
              ref={form.register}
              placeholder="Address 2"
              label="Address 2"
              name="address.address_2"
            />
          </div>
          <div className="grid grid-cols-2 gap-x-base gap-y-base">
            <Input
              mb={2}
              ref={form.register}
              placeholder="Province"
              label="Province"
              name="address.province"
            />
            <Input
              mb={2}
              ref={form.register({
                required: true,
              })}
              placeholder="Postal code"
              label="Postal code"
              required={true}
              name="address.postal_code"
            />
            <Input
              mb={2}
              ref={form.register}
              placeholder="City"
              label="City"
              ref={form.register({
                required: true,
              })}
              name="address.city"
            />

            {countryOptions.length === 1 ? (
              <Input
                ref={form.register}
                disabled
                name="address.country_code"
                label="Country"
                value={countryOptions[0].value}
              />
            ) : (
              <Select
                ref={form.register}
                name="address.country_code"
                label="Country"
                options={countryOptions}
                onChange={setCountry}
                value={selectedCountry}
                defaultValue="Choose a country"
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddressForm
