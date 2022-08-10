import {
  FulfillmentProvider,
  PaymentProvider,
  Region,
  Store,
} from "@medusajs/medusa"
import {
  useAdminCreateRegion,
  useAdminDeleteRegion,
  useAdminRegion,
  useAdminStore,
  useAdminUpdateRegion,
} from "medusa-react"
import React, { useEffect, useMemo, useState } from "react"
import { Controller, useForm } from "react-hook-form"
import Spinner from "../../../components/atoms/spinner"
import DuplicateIcon from "../../../components/fundamentals/icons/duplicate-icon"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import Input from "../../../components/molecules/input"
import Select from "../../../components/molecules/select"
import BodyCard from "../../../components/organisms/body-card"
import CurrencyInput from "../../../components/organisms/currency-input"
import DeletePrompt from "../../../components/organisms/delete-prompt"
import useNotification from "../../../hooks/use-notification"
import { Option } from "../../../types/shared"
import { countries as countryData } from "../../../utils/countries"
import { getErrorMessage } from "../../../utils/error-messages"
import fulfillmentProvidersMapper from "../../../utils/fulfillment-providers.mapper"
import paymentProvidersMapper from "../../../utils/payment-providers-mapper"
import Shipping from "./shipping"

type RegionDetailsProps = {
  id: string
  onDelete: () => void
  handleSelect: (id: string) => void
}

type RegionDetailsFormData = {
  name: string
  countries: Option[]
  currency_code: string
  payment_providers: Option[]
  fulfillment_providers: Option[]
}

const RegionDetails = ({ id, onDelete, handleSelect }: RegionDetailsProps) => {
  const [showDanger, setShowDanger] = useState(false)
  const notification = useNotification()

  const createRegion = useAdminCreateRegion()
  const deleteRegion = useAdminDeleteRegion(id)
  const updateRegion = useAdminUpdateRegion(id)

  const { region, isLoading: regionIsLoading } = useAdminRegion(id)
  const { store, isLoading: storeIsLoading } = useAdminStore()
  const { fulfillment_providers, payment_providers } = store as Store & {
    fulfillment_providers: FulfillmentProvider[]
    payment_providers: PaymentProvider[]
  }

  const { register, reset, handleSubmit, control } = useForm<
    RegionDetailsFormData
  >()

  useEffect(() => {
    if (region) {
      reset(mapRegion(region))
    }
  }, [region])

  const countryOptions = useMemo(() => {
    return countryData.map((c) => ({
      label: c.name,
      value: c.alpha2.toLowerCase(),
    }))
  }, [countryData])

  const paymentProviderOptions = useMemo(() => {
    return payment_providers.map((p) => paymentProvidersMapper(p.id))
  }, [payment_providers])

  const fulfillmentProviderOptions = useMemo(() => {
    return fulfillment_providers.map((p) => fulfillmentProvidersMapper(p.id))
  }, [fulfillment_providers])

  const currencyOptions = useMemo(() => {
    return store?.currencies.map((c) => c.code) || []
  }, [store])

  const onSave = async (data: RegionDetailsFormData) => {
    updateRegion.mutate(
      {
        ...data,
        countries: data.countries.map((country) => country.value),
        payment_providers: data.payment_providers.map(
          (provider) => provider.value
        ),
        fulfillment_providers: data.fulfillment_providers.map(
          (provider) => provider.value
        ),
      },
      {
        onSuccess: () => {
          notification("Success", "Successfully updated region", "success")
        },
        onError: (error) => {
          notification("Error", getErrorMessage(error), "error")
        },
      }
    )
  }

  const handleDuplicate = () => {
    if (!region) {
      notification("Error", "Region not found", "error")
      return
    }

    const payload = {
      currency_code: region.currency_code,
      payment_providers: region.payment_providers.map((p) => p.id),
      fulfillment_providers: region.fulfillment_providers.map((f) => f.id),
      countries: [], // As countries can't belong to more than one region at the same time we can just pass an empty array
      name: `${region.name} Copy`,
      tax_rate: region.tax_rate,
    }

    createRegion.mutate(payload, {
      onSuccess: ({ region }) => {
        notification("Success", "Successfully duplicated region", "success")
        handleSelect(region.id)
      },
      onError: (error) => {
        notification("Error", getErrorMessage(error), "error")
      },
    })
  }

  const handleDelete = async () => {
    deleteRegion.mutate(undefined, {
      onSuccess: () => {
        onDelete()
      },
      onError: (error) => {
        notification("Error", getErrorMessage(error), "error")
      },
    })
  }

  if (storeIsLoading) {
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
                  {...register("name", { required: true })}
                  label="Name"
                  placeholder="Region name..."
                  className="mb-base"
                />
                <Controller
                  name="currency_code"
                  control={control}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <CurrencyInput.Root
                        currentCurrency={value}
                        currencyCodes={currencyOptions}
                        onChange={onChange}
                        className="mb-base"
                      />
                    )
                  }}
                />
                <Controller
                  name="countries"
                  control={control}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <Select
                        isMultiSelect
                        enableSearch
                        label="Countries"
                        hasSelectAll
                        options={countryOptions}
                        value={value}
                        onChange={onChange}
                        className="mb-base"
                      />
                    )
                  }}
                />
                <Controller
                  name="payment_providers"
                  control={control}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <Select
                        isMultiSelect
                        onChange={onChange}
                        options={paymentProviderOptions}
                        value={value}
                        label="Payment Providers"
                        enableSearch
                        className="mb-base"
                      />
                    )
                  }}
                />
                <Controller
                  name="fulfillment_providers"
                  control={control}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <Select
                        onChange={onChange}
                        options={fulfillmentProviderOptions}
                        value={value}
                        label="Fulfillment Providers"
                        enableSearch
                        isMultiSelect
                      />
                    )
                  }}
                />
              </div>
            )}
          </div>
        </form>
        {region && fulfillmentProviderOptions && (
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

const mapRegion = (region: Region): RegionDetailsFormData => {
  return {
    name: region.name,
    countries: region.countries.map((c) => ({
      value: c.iso_2,
      label: c.display_name,
    })),
    currency_code: region.currency_code,
    payment_providers: region.payment_providers.map((p) =>
      paymentProvidersMapper(p.id)
    ),
    fulfillment_providers: region.fulfillment_providers.map((f) =>
      fulfillmentProvidersMapper(f.id)
    ),
  }
}

export default RegionDetails
