import React, { useState, useEffect } from "react"
import { Flex, Text, Box } from "rebass"
import { useForm } from "react-hook-form"

import useMedusa from "../../../hooks/use-medusa"
import Input from "../../../components/input"
import Select from "../../../components/select"
import Card from "../../../components/card"
import Button from "../../../components/button"
import Spinner from "../../../components/spinner"
import TagDropdown from "../../../components/tag-dropdown"

import { currencies as currencyData } from "../../../utils/currencies"
import { countries as countryData } from "../../../utils/countries"

import Shipping from "./shipping"

const Regions = ({ id }) => {
  const [currencies, setCurrencies] = useState([])
  const [countries, setCountries] = useState([])
  const [paymentOptions, setPaymentOptions] = useState([])
  const [paymentProviders, setPaymentProviders] = useState([])
  const [fulfillmentOptions, setFulfillmentOptions] = useState([])
  const [fulfillmentProviders, setFulfillmentProviders] = useState([])

  const { store, isLoading: storeIsLoading } = useMedusa("store")
  const {
    region,
    isLoading,
    fulfillmentOptions: fulfillmentEndpoint,
    update,
  } = useMedusa("regions", { id })
  const { register, reset, setValue, getValues, handleSubmit } = useForm()

  useEffect(() => {
    if (storeIsLoading) return
    setCurrencies(
      store.currencies.map(c => ({
        symbol: currencyData[c].symbol_native,
        value: c,
        code: c,
      }))
    )
    setPaymentOptions(
      store.payment_providers.map(c => ({
        value: c,
        label: c,
      }))
    )
    setFulfillmentOptions(
      store.fulfillment_providers.map(c => ({
        value: c,
        label: c,
      }))
    )
  }, [store, storeIsLoading])

  useEffect(() => {
    if (isLoading) return
    reset(region)
    register({ name: "countries" })
    register({ name: "payment_providers" })
    register({ name: "fulfillment_providers" })

    setValue("countries", region.countries)
    setCountries(region.countries.map(v => ({ value: v })))

    setValue("payment_providers", region.payment_providers)
    setPaymentProviders(region.payment_providers.map(v => ({ value: v })))
    setValue("fulfillment_providers", region.fulfillment_providers)
    setFulfillmentProviders(
      region.fulfillment_providers.map(v => ({ value: v }))
    )
  }, [region, isLoading])

  const handlePaymentChange = values => {
    setPaymentProviders(values)
    setValue(
      "payment_providers",
      values.map(c => c.value)
    )
  }

  const handleFulfillmentChange = values => {
    setFulfillmentProviders(values)
    setValue(
      "fulfillment_providers",
      values.map(c => c.value)
    )
  }

  const handleChange = values => {
    setCountries(values)
    setValue(
      "countries",
      values.map(c => c.value)
    )
  }

  const onSave = data => {
    update(data)
  }

  const countryOptions = countryData.map(c => ({
    label: c.name,
    value: c.alpha2,
  }))

  return (
    <Flex flexDirection="column">
      <Card as="form" mb={3} onSubmit={handleSubmit(onSave)}>
        <Card.Header>Region Details</Card.Header>
        <Card.Body flexDirection="column">
          {isLoading || storeIsLoading ? (
            <Flex
              flexDirection="column"
              alignItems="center"
              height="100vh"
              mt="auto"
            >
              <Box height="75px" width="75px" mt="50%">
                <Spinner dark />
              </Box>
            </Flex>
          ) : (
            <Box width={1 / 2}>
              <Input inline mb={3} name="name" label="Name" ref={register} />
              <Select
                inline
                mb={3}
                label="Currency"
                name="currency_code"
                options={currencies}
                ref={register}
              />
              <Input
                inline
                mb={3}
                type="number"
                step="0.01"
                min={0}
                max={1}
                name="tax_rate"
                label="Tax Rate"
                ref={register}
              />
              <TagDropdown
                inline
                mb={3}
                label={"Countries"}
                toggleText="Select Countries"
                values={countries}
                onChange={handleChange}
                options={countryOptions}
                optionRender={o => <span>{o.label}</span>}
                valueRender={o => <span>{o.value}</span>}
              />
              {!!paymentOptions.length && (
                <TagDropdown
                  inline
                  mb={3}
                  label={"Payment Providers"}
                  toggleText="Select Providers"
                  values={paymentProviders}
                  onChange={handlePaymentChange}
                  options={paymentOptions}
                  optionRender={o => <span>{o.label}</span>}
                  valueRender={o => <span>{o.value}</span>}
                />
              )}
              {!!fulfillmentOptions.length && (
                <TagDropdown
                  inline
                  mb={3}
                  label={"Fulfillment Providers"}
                  toggleText="Select Providers"
                  values={fulfillmentProviders}
                  onChange={handleFulfillmentChange}
                  options={fulfillmentOptions}
                  optionRender={o => <span>{o.label}</span>}
                  valueRender={o => <span>{o.value}</span>}
                />
              )}
            </Box>
          )}
        </Card.Body>
        <Card.Footer px={3} justifyContent="flex-end">
          <Button type="submit" variant="primary">
            Save
          </Button>
        </Card.Footer>
      </Card>
      {!isLoading && (
        <Shipping region={region} fulfillmentMethods={fulfillmentEndpoint} />
      )}
    </Flex>
  )
}

export default Regions
