import {
  useAdminRegion,
  useAdminRegionFulfillmentOptions,
  useAdminStore,
  useAdminStorePaymentProviders,
} from "medusa-react"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Box, Flex } from "rebass"
import DuplicateIcon from "../../../components/fundamentals/icons/duplicate-icon"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import Input from "../../../components/molecules/input"
import Select from "../../../components/molecules/select"
import BodyCard from "../../../components/organisms/body-card"
import Spinner from "../../../components/spinner"
import useMedusa from "../../../hooks/use-medusa"
import useToaster from "../../../hooks/use-toaster"
import { countries as countryData } from "../../../utils/countries"
import { getErrorMessage } from "../../../utils/error-messages"
import fulfillmentProvidersMapper from "../../../utils/fulfillment-providers.mapper"
import paymentProvidersMapper from "../../../utils/payment-providers-mapper"
import Shipping from "./shipping"

const RegionDetails = ({ id }) => {
  const [currencies, setCurrencies] = useState([])
  const [countries, setCountries] = useState([])
  const [selectedCurrency, setSelectedCurrency] = useState(null)
  const [paymentOptions, setPaymentOptions] = useState([])
  const [paymentProviders, setPaymentProviders] = useState([])
  const [fulfillmentOptions, setFulfillmentOptions] = useState([])
  const [fulfillmentProviders, setFulfillmentProviders] = useState([])

  const { update } = useMedusa("regions")
  const { register, reset, setValue, handleSubmit } = useForm()
  const toaster = useToaster()

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
    if (!store || !region) return
    console.log(region)
    register({ name: "currency_code" })
    setValue("currency_code", region.currency_code)
    setSelectedCurrency({
      value: region.currency_code,
      label: region.currency_code.toUpperCase(),
    })
    setCurrencies(getCurrencies(store.currencies))
  }, [store, region])

  useEffect(() => {
    if (paymentIsLoading) return
    setPaymentOptions(payment_providers.map(c => paymentProvidersMapper(c.id)))
  }, [payment_providers, paymentIsLoading])

  useEffect(() => {
    if (fulfillmentIsLoading) return
    setFulfillmentOptions(
      fulfillment_options.map(c => fulfillmentProvidersMapper(c.provider_id))
    )
  }, [fulfillment_options, fulfillmentIsLoading])

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
    setPaymentProviders(
      region.payment_providers.map(v => paymentProvidersMapper(v.id))
    )

    setValue(
      "fulfillment_providers",
      region.fulfillment_providers.map(v => v.id)
    )
    setFulfillmentProviders(
      region.fulfillment_providers.map(v => fulfillmentProvidersMapper(v.id))
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

  const handleChangeCurrency = value => {
    setValue("currency_code", value)
    setSelectedCurrency(value)
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
      actionables={[
        {
          label: "Duplicate Region",
          onClick: () => {},
          icon: <DuplicateIcon />,
        },
        {
          label: "Delete Region",
          onClick: () => {},
          icon: <TrashIcon />,
          variant: "danger",
        },
      ]}
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
                name="name"
                label="Name"
                ref={register}
                className="mb-base"
              />
              <Select
                enableSearch
                label="Currency"
                name="currency_code"
                options={currencies}
                value={selectedCurrency}
                onChange={handleChangeCurrency}
                className="mb-base"
              />
              <Input
                className="mb-base"
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
                placeholder="1000"
                name="tax_code"
                label="Tax Code"
                ref={register}
                className="mb-base"
              />
              <Select
                isMultiSelect
                enableSearch
                label="Countries"
                hasSelectAll
                options={countryOptions}
                value={countries}
                onChange={handleChange}
                className="mb-base"
              />
              {!!paymentOptions.length && (
                <Select
                  isMultiSelect
                  onChange={handlePaymentChange}
                  options={paymentOptions}
                  value={paymentProviders}
                  label="Payment Providers"
                  enableSearch
                  className="mb-base"
                />
              )}
              {!!fulfillmentOptions.length && (
                <Select
                  onChange={handleFulfillmentChange}
                  options={fulfillmentOptions}
                  value={fulfillmentProviders}
                  label="Fulfillment Providers"
                  enableSearch
                  isMultiSelect
                />
              )}
            </div>
          )}
        </div>
      </form>
      {region && fulfillment_options && (
        <div className="mt-2xlarge">
          <Shipping region={region} />
        </div>
      )}
    </BodyCard>
  )
}

export default RegionDetails
