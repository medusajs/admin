import { Region } from "@medusajs/medusa"
import {
  useAdminCreateShippingOption,
  useAdminRegionFulfillmentOptions,
  useAdminShippingProfiles,
} from "medusa-react"
import React, { useMemo } from "react"
import { Controller, useForm } from "react-hook-form"
import Checkbox from "../../../components/atoms/checkbox"
import Button from "../../../components/fundamentals/button"
import Input from "../../../components/molecules/input"
import Modal from "../../../components/molecules/modal"
import Select from "../../../components/molecules/select"
import CurrencyInput from "../../../components/organisms/currency-input"
import useNotification from "../../../hooks/use-notification"
import { Option } from "../../../types/shared"
import { getErrorMessage } from "../../../utils/error-messages"
import fulfillmentProvidersMapper from "../../../utils/fulfillment-providers.mapper"

type NewShippingProps = {
  isReturn: boolean
  region: Region
  onCreated: () => void
  onClick: () => void
}

type NewShippingFormData = {
  requirements: {
    min_subtotal: {
      amount: number
    }
    max_subtotal: {
      amount: number
    }
  }
  name: string
  fulfilment_option: Option
  profile_id: Option
  admin_only: boolean
  amount: number
}

type OptionType = {
  id: string
  name?: string
  is_return?: boolean
}

const NewShipping = ({
  isReturn,
  region,
  onCreated,
  onClick,
}: NewShippingProps) => {
  const { register, handleSubmit, control } = useForm<NewShippingFormData>()

  const { shipping_profiles } = useAdminShippingProfiles()
  const { fulfillment_options } = useAdminRegionFulfillmentOptions(region.id)
  const createShippingOption = useAdminCreateShippingOption()

  const shippingProfileOptions: Option[] = useMemo(() => {
    return (
      shipping_profiles?.map(({ id, name }) => ({
        label: name,
        value: id,
      })) || []
    )
  }, [shipping_profiles])

  const fulfillmentOptions: Option[] = useMemo(() => {
    if (!fulfillment_options) {
      return []
    }

    const options = fulfillment_options.reduce((acc, current, index) => {
      const opts = current.options as OptionType[]

      const filtered = opts.filter((o) => !!o.is_return === !!isReturn)

      return acc.concat(
        filtered.map((option, o) => ({
          label: `${option.name || option.id} via ${
            fulfillmentProvidersMapper(current.provider_id).label
          }`,
          value: `${index}.${o}`,
        }))
      )
    }, [] as Option[])

    return options
  }, [fulfillment_options])

  const notification = useNotification()

  const onSave = (data: NewShippingFormData) => {
    const fOptions = fulfillment_options?.map((provider) => {
      const options = provider.options as OptionType[]

      const filtered = options.filter((o) => !!o.is_return === !!isReturn)

      return {
        ...provider,
        options: filtered,
      }
    })

    const [providerIndex, optionIndex] = data.fulfilment_option.value.split(".")
    const { provider_id, options } = fOptions?.[providerIndex] || {}

    let reqs: { type: string; amount: number }[] = []
    if (data.requirements) {
      reqs = Object.entries(data.requirements).reduce((acc, [key, value]) => {
        if (value.amount && value.amount > 0) {
          acc.push({ type: key, amount: value.amount })
          return acc
        } else {
          return acc
        }
      }, [] as { type: string; amount: number }[])
    }

    const payload = {
      name: data.name,
      data: options[optionIndex],
      region_id: region.id,
      profile_id: data.profile_id?.value,
      requirements: reqs,
      price_type: "flat_rate",
      amount: data.amount,
      is_return: isReturn,
      provider_id,
      admin_only: !data.admin_only,
    }

    createShippingOption.mutate(payload, {
      onSuccess: () => {
        notification(
          "Success",
          "Successfully created shipping option",
          "success"
        )
        if (onCreated) {
          onCreated()
        }
        onClick()
      },
      onError: (error) => {
        notification("Error", getErrorMessage(error), "error")
      },
    })
  }

  return (
    <Modal handleClose={onClick}>
      <form onSubmit={handleSubmit(onSave)}>
        <Modal.Body>
          <Modal.Header handleClose={onClick}>
            <div>
              <h1 className="inter-xlarge-semibold">
                {isReturn
                  ? "Add Return Shipping Option"
                  : "Add Shipping Option"}
              </h1>
            </div>
          </Modal.Header>
          <Modal.Content>
            <div className="grid grid-cols-1 medium:grid-cols-2 gap-base">
              <Input
                label="Name"
                {...register("name", { required: true })}
                required
                placeholder="New Shipping Option"
                className="flex-grow"
              />
              <CurrencyInput
                currentCurrency={region.currency_code}
                readOnly
                size="small"
              >
                <Controller
                  name="amount"
                  control={control}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <CurrencyInput.AmountInput
                        label="Price"
                        onChange={onChange}
                        amount={value}
                      />
                    )
                  }}
                />
              </CurrencyInput>
            </div>
            <div className="mt-large mb-xlarge">
              <Checkbox
                {...register("admin_only")}
                label="Show on website"
                defaultChecked={true}
              />
            </div>
            {!isReturn && (
              <div className="mb-base">
                <Controller
                  control={control}
                  name="profile_id"
                  render={({ field: { value, onChange } }) => {
                    return (
                      <Select
                        label="Shipping Profile"
                        value={value}
                        onChange={onChange}
                        required
                        name="profile_id"
                        options={shippingProfileOptions}
                      />
                    )
                  }}
                />
              </div>
            )}
            <div className="mb-base">
              <Controller
                control={control}
                name="fulfilment_option"
                render={({ field: { value, onChange } }) => {
                  return (
                    <Select
                      label="Fulfillment Method"
                      value={value}
                      onChange={onChange}
                      required
                      name="fulfillment_option"
                      options={fulfillmentOptions}
                    />
                  )
                }}
              />
            </div>
            {!isReturn && (
              <div>
                <p className="inter-base-semibold mb-base">Requirements</p>
                <div className="grid grid-cols-1 medium:grid-cols-2 gap-base">
                  <CurrencyInput
                    currentCurrency={region.currency_code}
                    readOnly
                    size="small"
                  >
                    <Controller
                      control={control}
                      name="requirements.min_subtotal.amount"
                      render={({ field: { value, onChange } }) => {
                        return (
                          <CurrencyInput.AmountInput
                            label="Price"
                            onChange={onChange}
                            amount={value}
                          />
                        )
                      }}
                    />
                  </CurrencyInput>
                  <CurrencyInput
                    currentCurrency={region.currency_code}
                    readOnly
                    size="small"
                  >
                    <Controller
                      control={control}
                      name="requirements.max_subtotal.amount"
                      render={({ field: { value, onChange } }) => {
                        return (
                          <CurrencyInput.AmountInput
                            label="Price"
                            onChange={onChange}
                            amount={value}
                          />
                        )
                      }}
                    />
                  </CurrencyInput>
                </div>
              </div>
            )}
          </Modal.Content>
          <Modal.Footer>
            <div className="flex justify-end w-full gap-x-xsmall">
              <Button
                variant="secondary"
                size="small"
                className="justify-center w-eventButton"
                onClick={onClick}
                type="button"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="small"
                className="justify-center w-eventButton"
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

export default NewShipping
