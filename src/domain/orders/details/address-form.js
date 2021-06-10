import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Flex, Text } from "rebass"
import { isEmpty } from "lodash"

import Select from "../../../components/select"
import Input from "../../../components/input"

import { countries } from "../../../utils/countries"

const AddressForm = ({ form = {}, country, address, allowedCountries }) => {
  const countryOptions = countries
    .map(c => {
      if (allowedCountries) {
        const clean = allowedCountries.map(c => c.toLowerCase())
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

  const inputStyle = {
    height: "28px",
  }

  useEffect(() => {
    console.log(address)

    if (!isEmpty(address)) {
      form.reset({ address: { ...address } })
    } else if (country) {
      form.setValue("address.country_code", country)
    }
  }, [])

  return (
    <Flex width="100%" sx={{ flexDirection: "column" }}>
      <Flex width="100%" flexDirection="column" alignItems="baseline" mb={3}>
        <Flex mb={3} width="100%">
          <Text mr={3} textAlign="right" fontSize={1} flex="30% 0 0">
            Country
          </Text>
          {countryOptions.length === 1 ? (
            <>
              <Text fontSize={1}>{countryOptions[0].label}</Text>
              <input
                ref={form.register}
                name="address.country_code"
                type="hidden"
                value={countryOptions[0].value}
              />
            </>
          ) : (
            <Select
              ref={form.register}
              name="address.country_code"
              flex="50% 0 0"
              selectStyle={{ maxWidth: "210px" }}
              options={countryOptions}
              defaultValue="Choose a country"
            />
          )}
        </Flex>
        <Flex width="100%">
          <Text mr={3} textAlign="right" fontSize={1} flex="30% 0 0">
            Address
          </Text>
          <Flex sx={{ flexDirection: "column", flex: "50% 0 0" }}>
            <Flex mb={2}>
              <Input
                mr={1}
                inputStyle={inputStyle}
                ref={form.register({
                  required: true,
                })}
                placeholder="First Name"
                required={true}
                name="address.first_name"
              />
              <Input
                inputStyle={inputStyle}
                ref={form.register({
                  required: true,
                })}
                placeholder="Last Name"
                required={true}
                name="address.last_name"
              />
            </Flex>
            <Input
              mb={2}
              inputStyle={inputStyle}
              ref={form.register({
                required: true,
              })}
              placeholder="Address 1"
              required={true}
              name="address.address_1"
            />
            <Input
              mb={2}
              inputStyle={inputStyle}
              ref={form.register}
              placeholder="Address 2"
              name="address.address_2"
            />
            <Input
              mb={2}
              inputStyle={inputStyle}
              ref={form.register}
              placeholder="Province"
              name="address.province"
            />
            <Input
              mb={2}
              inputStyle={inputStyle}
              ref={form.register({
                required: true,
              })}
              placeholder="Postal code"
              required={true}
              name="address.postal_code"
            />
            <Input
              mb={2}
              inputStyle={inputStyle}
              ref={form.register}
              placeholder="City"
              ref={form.register({
                required: true,
              })}
              name="address.city"
            />
            <Input
              mb={2}
              inputStyle={inputStyle}
              ref={form.register({
                required: true,
              })}
              placeholder="Phone"
              required={true}
              name="address.phone"
            />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default AddressForm
