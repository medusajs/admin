import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Flex, Text } from "rebass"
import { isEmpty } from "lodash"
import Select from "../select"
import Input from "../input"
import { countries } from "../../utils/countries"

const inputStyle = {
  height: "33px",
}

const AddressForm = ({
  form = {},
  country,
  allowedCountries,
  type = "address",
}) => {
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

  useEffect(() => {
    if (country) {
      form.setValue(`${[type].country_code}`, country)
    }
  }, [])

  return (
    <Flex width="100%" sx={{ flexDirection: "column" }}>
      <Flex width="100%" flexDirection="column" mb={3}>
        <Flex mb={3} width="100%">
          <Text mr={3} fontSize={1} flex="10% 0 0">
            Country
          </Text>
          {countryOptions.length === 1 ? (
            <>
              <Text fontSize={1}>{countryOptions[0].label}</Text>
              <input
                ref={form.register}
                name={`${[type]}.country_code`}
                type="hidden"
                value={countryOptions[0].value}
              />
            </>
          ) : (
            <Select
              ref={form.register}
              name={`${[type]}.country_code`}
              flex="50% 0 0"
              value={country || null}
              placeholder="Select country in region"
              selectStyle={{ maxWidth: "210px" }}
              options={countryOptions}
            />
          )}
        </Flex>
        <Flex width="100%">
          <Text mr={3} fontSize={1} flex="10% 0 0">
            Address
          </Text>
          <Flex sx={{ flexDirection: "column", flex: "100%" }}>
            <Flex mb={2} flex={"100%"}>
              <Input
                mr={1}
                sx={{ flex: 1 }}
                inputStyle={inputStyle}
                ref={form.register({
                  required: true,
                })}
                placeholder="First Name"
                required={true}
                name={`${[type]}.first_name`}
              />
              <Input
                sx={{ flex: 1 }}
                inputStyle={inputStyle}
                ref={form.register({
                  required: true,
                })}
                placeholder="Last Name"
                required={true}
                name={`${[type]}.last_name`}
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
              name={`${[type]}.address_1`}
            />
            <Input
              mb={2}
              inputStyle={inputStyle}
              ref={form.register}
              placeholder="Address 2"
              name={`${[type]}.address_2`}
            />
            <Input
              mb={2}
              inputStyle={inputStyle}
              ref={form.register}
              placeholder="Province"
              name={`${[type]}.province`}
            />
            <Input
              mb={2}
              inputStyle={inputStyle}
              ref={form.register({
                required: true,
              })}
              placeholder="Postal code"
              required={true}
              name={`${[type]}.postal_code`}
            />
            <Input
              mb={2}
              inputStyle={inputStyle}
              ref={form.register}
              placeholder="City"
              ref={form.register({
                required: true,
              })}
              name={`${[type]}.city`}
            />
            <Input
              mb={2}
              inputStyle={inputStyle}
              ref={form.register({
                required: true,
              })}
              placeholder="Phone"
              required={true}
              name={`${[type]}.phone`}
            />
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}
export default AddressForm
