import React, { useState, useEffect } from "react"
import { Flex, Text, Box } from "rebass"
import { useForm } from "react-hook-form"
import { navigate } from "gatsby"

import useMedusa from "../../../hooks/use-medusa"
import Input from "../../../components/input"
import Select from "../../../components/select"
import Card from "../../../components/card"
import Button from "../../../components/button"
import Spinner from "../../../components/spinner"
import TagDropdown from "../../../components/tag-dropdown"

import Medusa from "../../../services/api"
import { currencies as currencyData } from "../../../utils/currencies"
import { countries as countryData } from "../../../utils/countries"

import Shipping from "./shipping"

const NewRegion = ({ id }) => {
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

  const handlePaymentChange = values => {
    setPaymentProviders(values)
    register({ name: "payment_providers" })
    setValue(
      "payment_providers",
      values.map(c => c.value)
    )
  }

  const handleFulfillmentChange = values => {
    setFulfillmentProviders(values)
    register({ name: "fulfillment_providers" })
    setValue(
      "fulfillment_providers",
      values.map(c => c.value)
    )
  }

  const handleChange = values => {
    setCountries(values)
    register({ name: "countries" })
    setValue(
      "countries",
      values.map(c => c.value)
    )
  }

  const onSave = data => {
    Medusa.regions.create(data).then(({ data }) => {
      navigate(`a/settings/regions/${data.region._id}`)
    })
  }

  const countryOptions = countryData.map(c => ({
    label: c.name,
    value: c.alpha2,
  }))

  return (
    <Flex as="form" onSubmit={handleSubmit(onSave)} flexDirection="column">
      <Box width={3 / 7}>
        <Input mb={3} name="name" label="Name" ref={register} />
        <Select
          mb={3}
          label="Currency"
          name="currency_code"
          options={currencies}
          ref={register}
        />
        <Input
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
      <Box width={"70px"}>
        <Button type="submit">Save</Button>
      </Box>
    </Flex>
  )
}

export default NewRegion
