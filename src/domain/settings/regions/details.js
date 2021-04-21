import React, { useState, useEffect } from "react"
import { Flex, Text, Box } from "rebass"
import styled from "@emotion/styled"
import { useForm } from "react-hook-form"
import paymentProvidersMapper from "../../../utils/payment-providers-mapper"

import MultiSelect from "../../../components/multi-select"
import useMedusa from "../../../hooks/use-medusa"
import Input from "../../../components/input"
import Select from "../../../components/select"
import Card from "../../../components/card"
import Button from "../../../components/button"
import Spinner from "../../../components/spinner"
import TagDropdown from "../../../components/tag-dropdown"

import { countries as countryData } from "../../../utils/countries"

import Shipping from "./shipping"
import fulfillmentProvidersMapper from "../../../utils/fulfillment-providers.mapper"

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
    toaster,
  } = useMedusa("regions", { id })
  const { register, reset, setValue, handleSubmit } = useForm()

  useEffect(() => {
    if (storeIsLoading) return
    if (store.currencies && region) {
      setCurrencies(getCurrencies(store.currencies))
    }
  }, [store, region, storeIsLoading])

  useEffect(() => {
    if (storeIsLoading) return
    setPaymentOptions(
      store.payment_providers.map(c => paymentProvidersMapper(c.id))
    )
    setFulfillmentOptions(
      store.fulfillment_providers.map(c => fulfillmentProvidersMapper(c.id))
    )
  }, [store, storeIsLoading])

  useEffect(() => {
    if (isLoading) return
    reset({ ...region, tax_rate: region.tax_rate / 100 })
    register({ name: "countries" })
    register({ name: "payment_providers" })
    register({ name: "fulfillment_providers" })

    setValue(
      "countries",
      region.countries.map(c => c.iso_2)
    )
    setCountries(
      region.countries.map(c => ({ value: c.iso_2, label: c.display_name }))
    )

    setValue(
      "payment_providers",
      region.payment_providers.map(v => v.id)
    )
    setPaymentProviders(region.payment_providers.map(v => ({ value: v.id })))

    setValue(
      "fulfillment_providers",
      region.fulfillment_providers.map(v => v.id)
    )
    setFulfillmentProviders(
      region.fulfillment_providers.map(v => ({ value: v.id }))
    )
  }, [region, isLoading])

  const getCurrencies = storeCurrencies => {
    let currs = storeCurrencies
      .filter(item => item.code !== region.currency_code)
      .map(el => el.code)
    currs.unshift(region.currency_code)

    return (
      currs.map(c => ({
        value: c,
        label: c.toUpperCase(),
      })) || []
    )
  }

  const handlePaymentChange = values => {
    const providers = values.map(v => ({ value: v.value }))
    setPaymentProviders(providers)
    setValue(
      "payment_providers",
      values.map(v => v.value)
    )
  }

  const handleFulfillmentChange = values => {
    const providers = values.map(v => ({ value: v.value }))
    setFulfillmentProviders(providers)
    setValue(
      "fulfillment_providers",
      values.map(v => v.value)
    )
  }

  const handleChange = values => {
    setCountries(values)
    setValue(
      "countries",
      values.map(c => c.value)
    )
  }

  const onSave = async data => {
    try {
      await update({ ...data, tax_rate: data.tax_rate * 100 })
      toaster("Successfully updated region", "success")
    } catch (error) {
      toaster("Failed to update region", "error")
    }
  }

  const countryOptions = countryData.map(c => ({
    label: c.name,
    value: c.alpha2.toLowerCase(),
  }))

  if (isLoading || !currencies.length) {
    return (
      <Flex flexDirection="column" alignItems="center" height="100vh" mt="auto">
        <Box height="75px" width="75px" mt="50%">
          <Spinner dark />
        </Box>
      </Flex>
    )
  }

  return (
    <Flex flexDirection="column" py={5} mb={5}>
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
            <Box width={1 / 2} ml={3}>
              <Input
                start={true}
                inline
                mb={3}
                name="name"
                label="Name"
                ref={register}
              />
              <Select
                start={true}
                inline
                mb={3}
                label="Currency"
                name="currency_code"
                options={currencies}
                ref={register}
              />
              <Input
                start={true}
                inline
                mb={3}
                type="number"
                placeholder="0.25"
                step="0.01"
                min={0}
                max={1}
                name="tax_rate"
                label="Tax Rate"
                ref={register}
              />
              <Input
                start={true}
                inline
                mb={3}
                placeholder="1000"
                name="tax_code"
                label="Tax Code"
                ref={register}
              />
              <MultiSelect
                inline
                start={true}
                mb={3}
                label="Countries"
                selectOptions={{ hasSelectAll: false }}
                options={countryOptions}
                value={countries}
                onChange={handleChange}
              />
              {!!paymentOptions.length && (
                <TagDropdown
                  inline
                  start={true}
                  mb={3}
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
                  inline
                  start={true}
                  mb={3}
                  label={"Fulfillment Providers"}
                  toggleText="Select"
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
          <Button type="submit" variant="primary" variant="cta">
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
