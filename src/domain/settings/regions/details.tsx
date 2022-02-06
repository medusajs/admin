import {
  useAdminCreateRegion,
  useAdminDeleteRegion,
  useAdminRegion,
  useAdminRegionFulfillmentOptions,
  useAdminStore,
  useAdminStorePaymentProviders,
  useAdminUpdateRegion,
} from "medusa-react"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import Spinner from "../../../components/atoms/spinner"
import DuplicateIcon from "../../../components/fundamentals/icons/duplicate-icon"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import Input from "../../../components/molecules/input"
import Select from "../../../components/molecules/select"
import BodyCard from "../../../components/organisms/body-card"
import CurrencyInput from "../../../components/organisms/currency-input"
import DeletePrompt from "../../../components/organisms/delete-prompt"
import useToaster from "../../../hooks/use-toaster"
import { Option } from "../../../types/shared"
import { countries as countryData } from "../../../utils/countries"
import { getErrorMessage } from "../../../utils/error-messages"
import fulfillmentProvidersMapper from "../../../utils/fulfillment-providers.mapper"
import paymentProvidersMapper from "../../../utils/payment-providers-mapper"
import Shipping from "./shipping"

const RegionDetails = ({ id, onDelete, handleSelect }) => {
  const [currencies, setCurrencies] = useState([])
  const [countries, setCountries] = useState<Option[]>([])
  const [selectedCurrency, setSelectedCurrency] = useState<string>()
  const [paymentOptions, setPaymentOptions] = useState<Option[]>([])
  const [paymentProviders, setPaymentProviders] = useState<Option[]>([])
  const [fulfillmentOptions, setFulfillmentOptions] = useState<Option[]>([])
  const [fulfillmentProviders, setFulfillmentProviders] = useState<Option[]>([])

  const { register, reset, setValue, handleSubmit } = useForm()
  const toaster = useToaster()

  const { store, isLoading: storeIsLoading } = useAdminStore()
  const createRegion = useAdminCreateRegion()
  const deleteRegion = useAdminDeleteRegion(id)
  const { region, isLoading: regionIsLoading } = useAdminRegion(id)
  const { payment_providers } = useAdminStorePaymentProviders()
  const { fulfillment_options } = useAdminRegionFulfillmentOptions(id)
  const updateRegion = useAdminUpdateRegion(id)

  const [showDanger, setShowDanger] = useState(false)

  useEffect(() => {
    if (!store || !region) {
      return
    }
    register({ name: "currency_code" })
    setValue("currency_code", region.currency_code)
    setSelectedCurrency(region.currency_code)
    setCurrencies(getCurrencies(store.currencies))
  }, [store, region])

  useEffect(() => {
    if (!payment_providers) {
      return
    }
    setPaymentOptions(
      payment_providers.map((c) => paymentProvidersMapper(c.id))
    )
  }, [payment_providers])

  useEffect(() => {
    if (!fulfillment_options) {
      return
    }
    setFulfillmentOptions(
      fulfillment_options.map((c) => fulfillmentProvidersMapper(c.provider_id))
    )
  }, [fulfillment_options])

  useEffect(() => {
    if (!region) {
      return
    }
    reset({ ...region, tax_rate: region.tax_rate / 100 })
    register({ name: "countries" })
    register({ name: "payment_providers" })
    register({ name: "fulfillment_providers" })

    setValue(
      "countries",
      region.countries.map((c) => c.iso_2)
    )
    setCountries(
      region.countries.map((c) => ({ value: c.iso_2, label: c.display_name }))
    )

    setValue(
      "payment_providers",
      region.payment_providers.map((v) => v.id)
    )
    setPaymentProviders(
      region.payment_providers.map((v) => paymentProvidersMapper(v.id))
    )

    setValue(
      "fulfillment_providers",
      region?.fulfillment_providers.map((v) => v.id)
    )
    setFulfillmentProviders(
      region.fulfillment_providers.map((v) => fulfillmentProvidersMapper(v.id))
    )
  }, [region])

  const getCurrencies = (storeCurrencies) => {
    const currs = storeCurrencies
      .filter((item) => item.code !== region?.currency_code)
      .map((el) => el.code)
    currs.unshift(region?.currency_code)

    return currs ?? []
  }

  const handlePaymentChange = (values) => {
    setPaymentProviders(values)
    setValue(
      "payment_providers",
      values.map((v) => v.value)
    )
  }

  const handleFulfillmentChange = (values) => {
    const providers = values.map((v) => ({ value: v.value }))
    setFulfillmentProviders(providers)
    setValue(
      "fulfillment_providers",
      values.map((v) => v.value)
    )
  }

  const handleChange = (values) => {
    setCountries(values)
    setValue(
      "countries",
      values.map((c) => c.value)
    )
  }

  const handleChangeCurrency = (value) => {
    setValue("currency_code", value)
    setSelectedCurrency(value)
  }

  const onSave = async (data) => {
    if (!data.countries || data.countries.length === 0) {
      return
    }

    updateRegion.mutate(
      {
        ...data,
        tax_rate: data.tax_rate * 100,
        currency_code: selectedCurrency,
      },
      {
        onSuccess: () => {
          toaster("Successfully updated region", "success")
        },
        onError: (error) => {
          toaster(getErrorMessage(error), "error")
        },
      }
    )
  }

  const countryOptions = countryData.map((c) => ({
    label: c.name,
    value: c.alpha2.toLowerCase(),
  }))

  const handleDuplicate = () => {
    if (!region) {
      toaster("Region not found", "error")
      return
    }

    const payload = {
      currency_code: region.currency_code,
      tax_rate: region.tax_rate,
      tax_code: region.tax_code,
      payment_providers: region.payment_providers.map((p) => p.id),
      fulfillment_providers: region.fulfillment_providers.map((f) => f.id),
      countries: [], // As countries can't belong to more than one region at the same time we can just pass an empty array
      name: `${region.name} Copy`,
    }

    createRegion.mutate(payload, {
      onSuccess: ({ region }) => {
        toaster("Successfully duplicated region", "success")
        handleSelect(region.id)
      },
      onError: (error) => {
        toaster(getErrorMessage(error), "error")
      },
    })
  }

  const handleDelete = async () => {
    deleteRegion.mutate(undefined, {
      onSuccess: () => {
        if (onDelete) {
          onDelete(null)
        }
      },
      onError: (error) => {
        toaster(getErrorMessage(error), "error")
      },
    })
  }

  if (storeIsLoading || !currencies.length) {
    return (
      <div className="flex flex-col items-center justify-center h-screen mt-auto">
        <div className="h-[75px] w-[75px] mt-[50%]">
          <Spinner />
        </div>
      </div>
    )
  }

  return (
    <>
      <BodyCard
        title="Details"
        events={[{ label: "Save", onClick: handleSubmit(onSave) }]}
        actionables={[
          {
            label: "Duplicate Region",
            onClick: handleDuplicate,
            icon: <DuplicateIcon />,
          },
          {
            label: "Delete Region",
            onClick: () => setShowDanger(true),
            icon: <TrashIcon />,
            variant: "danger",
          },
        ]}
      >
        <form onSubmit={handleSubmit(onSave)}>
          <div className="flex flex-col w-full">
            {regionIsLoading || storeIsLoading ? (
              <div className="flex flex-col items-center justify-center h-screen mt-auto">
                <div className="h-[75px] w-[75px] mt-[50%]">
                  <Spinner />
                </div>
              </div>
            ) : (
              <div className="w-full">
                <Input
                  name="name"
                  label="Name"
                  placeholder="Region name..."
                  ref={register({ required: true })}
                  className="mb-base"
                />
                <CurrencyInput
                  currentCurrency={selectedCurrency}
                  currencyCodes={currencies}
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
                  ref={register({ max: 1, min: 0 })}
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
      {showDanger && (
        <DeletePrompt
          handleClose={() => setShowDanger(!showDanger)}
          text="Are you sure you want to delete this region from your Medusa Store?"
          heading="Delete region"
          onDelete={handleDelete}
          successText="Successfully deleted region"
          confirmText="Yes, delete"
        />
      )}
    </>
  )
}

export default RegionDetails
