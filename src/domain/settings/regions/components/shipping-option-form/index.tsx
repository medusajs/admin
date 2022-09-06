import { Region } from "@medusajs/medusa"
import React from "react"
import { Controller, UseFormReturn } from "react-hook-form"
import Switch from "../../../../../components/atoms/switch"
import InputHeader from "../../../../../components/fundamentals/input-header"
import InputField from "../../../../../components/molecules/input"
import { NextSelect } from "../../../../../components/molecules/select/next-select"
import { Option } from "../../../../../types/shared"
import FormValidator from "../../../../../utils/form-validator"
import fulfillmentProvidersMapper from "../../../../../utils/fulfillment-providers.mapper"
import PriceFormInput from "../../../../products/components/prices-form/price-form-input"
import { useShippingOptionFormData } from "./use-shipping-option-form-data"

export type ShippingOptionFormType = {
  store_option: boolean
  name: string | null
  shipping_profile: Option | null
  fulfillment_provider: Option | null
  requirements: {
    min_subtotal: number | null
    max_subtotal: number | null
  }
}

type Props = {
  form: UseFormReturn<ShippingOptionFormType, any>
  region: Region
}

const ShippingOptionForm = ({ form, region }: Props) => {
  const {
    register,
    control,
    formState: { errors },
  } = form

  const { shippingProfileOptions } = useShippingOptionFormData()

  return (
    <div>
      <div>
        <div className="flex flex-col gap-y-2xsmall">
          <div className="flex items-center justify-between">
            <h3 className="inter-base-semibold mb-2xsmall">Visible in store</h3>
            <Controller
              control={control}
              name={"store_option"}
              render={({ field: { value, onChange } }) => {
                return <Switch checked={value} onCheckedChange={onChange} />
              }}
            />
          </div>
          <p className="inter-base-regular text-grey-50">
            Enable or disable the shipping option visiblity in store.
          </p>
        </div>
      </div>
      <div className="h-px w-full bg-grey-20 my-xlarge" />
      <div>
        <h3 className="inter-base-semibold mb-base">Details</h3>
        <div className="grid grid-cols-2 gap-large">
          <InputField
            label="Title"
            required
            {...register("name", {
              required: "Title is required",
              pattern: FormValidator.whiteSpaceRule("Title"),
              minLength: FormValidator.minOneCharRule("Title"),
            })}
            errors={errors}
          />
          <InputField
            label="Title"
            required
            {...register("name", {
              required: "Title is required",
              pattern: FormValidator.whiteSpaceRule("Title"),
              minLength: FormValidator.minOneCharRule("Title"),
            })}
            errors={errors}
          />
          <Controller
            control={control}
            name="shipping_profile"
            render={({ field }) => {
              return (
                <NextSelect
                  label="Shipping Profile"
                  required
                  options={shippingProfileOptions}
                  {...field}
                  errors={errors}
                />
              )
            }}
          />
          <Controller
            control={control}
            name="fulfillment_provider"
            render={({ field }) => {
              return (
                <NextSelect
                  label="Fulfillment Method"
                  required
                  options={region.fulfillment_providers.map((provider) =>
                    fulfillmentProvidersMapper(provider.id)
                  )}
                  {...field}
                  errors={errors}
                />
              )
            }}
          />
        </div>
      </div>
      <div className="h-px w-full bg-grey-20 my-xlarge" />
      <div>
        <h3 className="inter-base-semibold mb-base">Requirements</h3>
        <div className="grid grid-cols-2 gap-large">
          <Controller
            control={control}
            name="requirements.min_subtotal"
            rules={{
              min: FormValidator.nonNegativeNumberRule("Max. subtotal"),
              validate: (value) => {
                if (!value) {
                  return true
                }

                const maxSubtotal = form.getValues("requirements.max_subtotal")
                if (maxSubtotal && value > maxSubtotal) {
                  return "Min. subtotal must be less than max. subtotal"
                }
                return true
              },
            }}
            render={({ field: { value, onChange } }) => {
              return (
                <div>
                  <InputHeader label="Min. subtotal" className="mb-xsmall" />
                  <PriceFormInput
                    amount={value || undefined}
                    onChange={onChange}
                    name="requirements.min_subtotal"
                    currencyCode={region.currency_code}
                    errors={errors}
                  />
                </div>
              )
            }}
          />
          <Controller
            control={control}
            name="requirements.max_subtotal"
            rules={{
              min: FormValidator.nonNegativeNumberRule("Max. subtotal"),
              validate: (value) => {
                if (!value) {
                  return true
                }

                const minSubtotal = form.getValues("requirements.min_subtotal")
                if (minSubtotal && value < minSubtotal) {
                  return "Max. subtotal must be greater than min. subtotal"
                }
                return true
              },
            }}
            render={({ field: { value, onChange } }) => {
              return (
                <div>
                  <InputHeader label="Max. subtotal" className="mb-xsmall" />
                  <PriceFormInput
                    amount={value || undefined}
                    onChange={onChange}
                    name="requirements.max_subtotal"
                    currencyCode={region.currency_code}
                    errors={errors}
                  />
                </div>
              )
            }}
          />
        </div>
      </div>
    </div>
  )
}

export default ShippingOptionForm
