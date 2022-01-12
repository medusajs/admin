import {
  useAdminRegion,
  useAdminRegionFulfillmentOptions,
  useAdminStore,
  useAdminStorePaymentProviders,
} from "medusa-react"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Box, Flex } from "rebass"
import Input from "../../../components/molecules/input"
import MultiSelect from "../../../components/molecules/select"
import BodyCard from "../../../components/organisms/body-card"
import Select from "../../../components/select"
import Spinner from "../../../components/spinner"
import TagDropdown from "../../../components/tag-dropdown"
import useMedusa from "../../../hooks/use-medusa"
import { countries as countryData } from "../../../utils/countries"
import { getErrorMessage } from "../../../utils/error-messages"
import Shipping from "./shipping"

const RegionDetails = ({ id }) => {
  const [currencies, setCurrencies] = useState([])
  const [countries, setCountries] = useState([])
  const [paymentOptions, setPaymentOptions] = useState([])
  const [paymentProviders, setPaymentProviders] = useState([])
  const [fulfillmentOptions, setFulfillmentOptions] = useState([])
  const [fulfillmentProviders, setFulfillmentProviders] = useState([])

  // const { store, isLoading: storeIsLoading } = useMedusa("store")
  const { update, toaster } = useMedusa("regions")
  const { register, reset, setValue, handleSubmit } = useForm()

  const { store, isLoading: storeIsLoading } = useAdminStore()
  const { region, isLoading: regionIsLoading } = useAdminRegion(id)
  const {
    payment_providers,
    isLoading: paymentIsLoading,
  } = useAdminStorePaymentProviders()
  const {
    fulfillment_options,
    isLoading: fulfillmentIsLoading,
  } = useAdminRegionFulfillmentOptions(id)

  useEffect(() => {
    if (storeIsLoading || regionIsLoading) return

    setCurrencies(getCurrencies(store.currencies))
  }, [store, storeIsLoading, regionIsLoading])

  useEffect(() => {
    if (regionIsLoading) return
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
  }, [region, regionIsLoading])

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
    if (!data.countries || data.countries.length === 0) {
      return
    }

    try {
      await update({ ...data, tax_rate: data.tax_rate * 100 })

      toaster("Successfully updated region", "success")
    } catch (error) {
      toaster(getErrorMessage(error), "error")
    }
  }

  const countryOptions = countryData.map(c => ({
    label: c.name,
    value: c.alpha2.toLowerCase(),
  }))

  if (storeIsLoading || !currencies.length) {
    return (
      <Flex flexDirection="column" alignItems="center" height="100vh" mt="auto">
        <Box height="75px" width="75px" mt="50%">
          <Spinner dark />
        </Box>
      </Flex>
    )
  }

  return (
    <BodyCard
      title="Details"
      events={[{ label: "Save", onClick: handleSubmit(onSave) }]}
    >
      <form onSubmit={handleSubmit(onSave)}>
        <div className="flex flex-col w-full">
          {regionIsLoading || storeIsLoading ? (
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
            <div className="w-full">
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
                className="my-4"
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
                isMultiSelect
                enableSearch
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
            </div>
          )}
        </div>
      </form>
      {!regionIsLoading && fulfillment_options && (
        <Shipping region={region} fulfillmentMethods={fulfillment_options} />
      )}
    </BodyCard>
  )
}

export default RegionDetails
