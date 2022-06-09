import { FulfillmentProvider, PaymentProvider, Store } from "@medusajs/medusa"
import { useAdminCreateRegion, useAdminStore } from "medusa-react"
import React, { useMemo } from "react"
import { Controller, useForm } from "react-hook-form"
import Button from "../../../components/fundamentals/button"
import Input from "../../../components/molecules/input"
import Modal from "../../../components/molecules/modal"
import Select from "../../../components/molecules/select"
import CurrencyInput from "../../../components/organisms/currency-input"
import useNotification from "../../../hooks/use-notification"
import { Option } from "../../../types/shared"
import { countries as countryData } from "../../../utils/countries"
import { getErrorMessage } from "../../../utils/error-messages"
import fulfillmentProvidersMapper from "../../../utils/fulfillment-providers.mapper"
import paymentProvidersMapper from "../../../utils/payment-providers-mapper"

type NewRegionProps = {
  onSuccess: (id: string) => void
  onCancel: () => void
}

type NewRegionFormData = {
  name: string
  countries: Option[]
  currency_code: string
  payment_providers: Option[]
  fulfillment_providers: Option[]
  tax_rate: number
  tax_code: string
}

const NewRegion = ({ onSuccess, onCancel }: NewRegionProps) => {
  const { store } = useAdminStore()
  const { fulfillment_providers, payment_providers } = store as Store & {
    fulfillment_providers: FulfillmentProvider[]
    payment_providers: PaymentProvider[]
  }
  const createRegion = useAdminCreateRegion()
  const { register, handleSubmit, control } = useForm<NewRegionFormData>()
  const notification = useNotification()

  const fulfilmentOptions = useMemo(() => {
    return (
      fulfillment_providers?.map((c) => fulfillmentProvidersMapper(c.id)) || []
    )
  }, [fulfillment_providers])

  const paymentOptions = useMemo(() => {
    return payment_providers?.map((c) => paymentProvidersMapper(c.id)) || []
  }, [payment_providers])

  const currencyOptions: string[] = useMemo(() => {
    return store?.currencies?.map((c) => c.code) || []
  }, [store])

  const countryOptions = useMemo(() => {
    return countryData.map((c) => ({ label: c.name, value: c.alpha2 }))
  }, [countryData])

  const onSave = (data: NewRegionFormData) => {
    createRegion.mutate(
      {
        ...data,
        payment_providers: data.payment_providers.map((p) => p.value),
        fulfillment_providers: data.fulfillment_providers.map((p) => p.value),
        countries: data.countries.map((c) => c.value),
        currency_code: data.currency_code,
        tax_rate: data.tax_rate * 100,
      },
      {
        onSuccess: ({ region }) => {
          notification("Success", "Successfully created region", "success")
          onSuccess(region.id)
        },
        onError: (error) => {
          notification("Error", getErrorMessage(error), "error")
        },
      }
    )
  }

  return (
    <Modal handleClose={onCancel}>
      <form onSubmit={handleSubmit(onSave)}>
        <Modal.Body>
          <Modal.Header handleClose={onCancel}>
            <div>
              <h1 className="inter-xlarge-semibold">Add Region</h1>
            </div>
          </Modal.Header>
          <Modal.Content>
            <div>
              <p className="inter-base-semibold mb-base">General</p>
              <div className="grid grid-cols-1 medium:grid-cols-2 gap-y-xsmall gap-x-base">
                <Input
                  {...register("name", { required: true })}
                  label="Name"
                  placeholder="Region name..."
                  className="mb-base min-w-[335px] w-full"
                />
                <Controller
                  control={control}
                  name="currency_code"
                  render={({ field: { value, onChange } }) => {
                    return (
                      <CurrencyInput
                        currencyCodes={currencyOptions}
                        currentCurrency={value}
                        onChange={onChange}
                        className="items-baseline"
                      />
                    )
                  }}
                />
                <Input
                  className="mb-base min-w-[335px] w-full"
                  type="number"
                  placeholder="0.25"
                  step="0.01"
                  min={0}
                  max={1}
                  {...register("tax_rate", { max: 1, min: 0 })}
                  label="Tax Rate"
                />
                <Input
                  placeholder="1000"
                  {...register("tax_code")}
                  label="Tax Code"
                  className="mb-base min-w-[335px] w-full"
                />
                <Controller
                  control={control}
                  name="countries"
                  rules={{ required: true }}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <Select
                        isMultiSelect
                        enableSearch
                        label="Countries"
                        hasSelectAll
                        clearSelected
                        options={countryOptions}
                        value={value}
                        onChange={onChange}
                        className="mb-base min-w-[335px] w-full"
                      />
                    )
                  }}
                />
              </div>
            </div>
            <div className="mt-xlarge mb-small">
              <p className="inter-base-semibold mb-base">Providers</p>
              <div className="grid grid-cols-1 medium:grid-cols-2 gap-base">
                <Controller
                  control={control}
                  name="payment_providers"
                  render={({ field: { value, onChange } }) => {
                    return (
                      <Select
                        isMultiSelect
                        onChange={onChange}
                        options={paymentOptions}
                        value={value}
                        label="Payment Providers"
                        enableSearch
                      />
                    )
                  }}
                />
                <Controller
                  control={control}
                  name="fulfillment_providers"
                  render={({ field: { value, onChange } }) => {
                    return (
                      <Select
                        isMultiSelect
                        onChange={onChange}
                        options={fulfilmentOptions}
                        value={value}
                        label="Fulfillment Providers"
                        enableSearch
                      />
                    )
                  }}
                />
              </div>
            </div>
          </Modal.Content>
          <Modal.Footer>
            <div className="flex items-center justify-end w-full gap-x-xsmall">
              <Button
                type="button"
                onClick={onCancel}
                variant="secondary"
                size="small"
                className="w-eventButton justify-center"
              >
                Cancel Changes
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="small"
                className="w-eventButton justify-center"
              >
                Save
              </Button>
            </div>
          </Modal.Footer>
        </Modal.Body>
      </form>
    </Modal>
  )
}

export default NewRegion
