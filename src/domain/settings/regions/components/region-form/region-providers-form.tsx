import React from "react"
import { Controller } from "react-hook-form"
import { NextSelect } from "../../../../../components/molecules/select/next-select"
import { Option } from "../../../../../types/shared"
import { NestedForm } from "../../../../../utils/nested-form"
import { useStoreData } from "./use-store-data"

export type RegionProvidersFormType = {
  payment_providers: Option[]
  fulfillment_providers: Option[]
}

type Props = {
  form: NestedForm<RegionProvidersFormType>
}

const RegionProvidersForm = ({ form }: Props) => {
  const { control, path } = form
  const { fulfillmentProviderOptions, paymentProviderOptions } = useStoreData()

  return (
    <div className="grid grid-cols-2 gap-large">
      <Controller
        control={control}
        name={path("payment_providers")}
        rules={{
          required: "Payment providers are required",
        }}
        render={({ field }) => {
          return (
            <NextSelect
              label="Payment Providers"
              placeholder="Choose payment providers"
              options={paymentProviderOptions}
              isMulti
              isClearable
              selectAll
              {...field}
            />
          )
        }}
      />
      <Controller
        control={control}
        name={path("fulfillment_providers")}
        rules={{
          required: "Fulfillment providers are required",
        }}
        render={({ field }) => {
          return (
            <NextSelect
              label="Fulfillment Providers"
              placeholder="Choose fulfillment providers"
              options={fulfillmentProviderOptions}
              isMulti
              isClearable
              selectAll
              {...field}
            />
          )
        }}
      />
    </div>
  )
}

export default RegionProvidersForm
