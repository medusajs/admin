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
import MultiSelect from "../../../components/multi-select"

const NewRegion = ({ id }) => {
  const [currencies, setCurrencies] = useState([])
  const [countries, setCountries] = useState([])
  const [paymentOptions, setPaymentOptions] = useState([])
  const [paymentProviders, setPaymentProviders] = useState([])
  const [fulfillmentOptions, setFulfillmentOptions] = useState([])
  const [fulfillmentProviders, setFulfillmentProviders] = useState([])

  const { store, isLoading: storeIsLoading } = useMedusa("store")
  const { register, setValue, handleSubmit } = useForm()

  useEffect(() => {
    if (storeIsLoading) return
    setCurrencies(
      store.currencies.map(c => ({
        // symbol: c.symbol_native,
        value: c.code,
        label: c.code.toUpperCase(),
        // code: c.code,
      }))
    )
    setPaymentOptions(
      store.payment_providers.map(c => ({
        value: c.id,
        label: c.id,
      }))
    )
    setFulfillmentOptions(
      store.fulfillment_providers.map(c => ({
        value: c.id,
        label: c.id,
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
    Medusa.regions
      .create({ ...data, tax_rate: data.tax_rate * 100 })
      .then(() => {
        navigate(`/a/settings`)
      })
  }

  const countryOptions = countryData.map(c => ({
    label: c.name,
    value: c.alpha2,
  }))

  return (
    <Flex
      as="form"
      onSubmit={handleSubmit(onSave)}
      flexDirection="column"
      pt={5}
      alignItems="center"
      justifyContent="center"
      width="100%"
    >
      <Flex width={3 / 5} justifyContent="flex-start">
        <Text mb={4} fontWeight="bold" fontSize={20}>
          Region details
        </Text>
      </Flex>
      <Flex mb={5} width={3 / 5} flexDirection="column">
        <Input
          required={true}
          mb={3}
          name="name"
          label="Name"
          ref={register}
          width="75%"
        />
        <Select
          mb={3}
          label="Currency"
          name="currency_code"
          options={currencies}
          required={true}
          ref={register}
        />
        <Input
          mb={3}
          type="number"
          required={true}
          step="0.01"
          min={0}
          max={1}
          width="75%"
          placeholder={
            "A percentage given as a decimal number between 0 and 1."
          }
          name="tax_rate"
          label="Tax Rate"
          ref={register}
        />
        <Input
          mb={3}
          name="tax_code"
          label="Tax Code"
          ref={register}
          width="75%"
        />
        <MultiSelect
          mb={3}
          required={true}
          label="Countries"
          selectOptions={{ hasSelectAll: false }}
          options={countryOptions}
          value={countries}
          onChange={handleChange}
        />
        {!!paymentOptions.length && (
          <TagDropdown
            width="100%"
            mb={3}
            required={true}
            label={"Payment Providers"}
            toggleText="Select"
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
            required={true}
            label={"Fulfillment Providers"}
            toggleText="Select"
            values={fulfillmentProviders}
            onChange={handleFulfillmentChange}
            options={fulfillmentOptions}
            optionRender={o => <span>{o.label}</span>}
            valueRender={o => <span>{o.value}</span>}
          />
        )}
        <Flex mt={4} width="75%">
          <Box ml="auto" />
          <Button variant={"cta"} type="submit">
            Save
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default NewRegion
