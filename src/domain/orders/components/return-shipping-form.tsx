import { Order } from "@medusajs/medusa"
import { useAdminShippingOptions } from "medusa-react"
import React, { useMemo } from "react"
import { Controller, useWatch } from "react-hook-form"
import Button from "../../../components/fundamentals/button"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import { NextSelect } from "../../../components/molecules/select/next-select"
import { Option } from "../../../types/shared"
import { NestedForm } from "../../../utils/nested-form"
import PriceFormInput from "../../products/components/prices-form/price-form-input"

export type ReturnShippingFormType = {
  option: Option | null
  price?: number
}

type Props = {
  form: NestedForm<ReturnShippingFormType>
  order: Order
}

const ReturnShippingForm = ({ form, order }: Props) => {
  const {
    control,
    path,
    setValue,
    formState: { errors },
  } = form

  const { shipping_options: returnOptions } = useAdminShippingOptions({
    region_id: order.region_id,
    is_return: true,
  })

  const returnShippingOptions = useMemo(() => {
    return (
      returnOptions?.map((o) => ({
        label: o.name,
        value: o.id,
      })) || []
    )
  }, [returnOptions])

  const selectedReturnOption = useWatch({
    control,
    name: path("option"),
  })

  const selectedReturnOptionPrice = useWatch({
    control,
    name: path("price"),
  })

  const setDefaultCustomPrice = () => {
    if (selectedReturnOption) {
      const option = returnOptions?.find(
        (ro) => ro.id === selectedReturnOption.value
      )

      setValue(path("price"), option?.amount || 0)
    }
  }

  const deleteCustomPrice = () => {
    setValue(path("price"), undefined)
  }

  return (
    <div className="flex flex-col gap-y-base">
      <h2 className="inter-base-semibold">Shipping</h2>
      <Controller
        control={control}
        name={path("option")}
        render={({ field: { value, onChange, onBlur } }) => {
          return (
            <NextSelect
              placeholder="Choose shipping method"
              label="Shipping method"
              options={returnShippingOptions}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
            />
          )
        }}
      />
      {selectedReturnOption && (
        <div className="w-full justify-end flex items-center">
          {selectedReturnOptionPrice !== undefined ? (
            <div className="flex items-center justify-end w-full">
              <div className="grid grid-cols-[1fr_40px] gap-x-xsmall">
                <Controller
                  control={control}
                  name={path("price")}
                  render={({ field: { value, onChange } }) => {
                    return (
                      <PriceFormInput
                        currencyCode={order.currency_code}
                        onChange={onChange}
                        amount={value}
                        name={path("price")}
                        errors={errors}
                      />
                    )
                  }}
                />
                <Button
                  variant="secondary"
                  size="small"
                  className="w-10 h-10 flex items-center justify-center"
                  type="button"
                  onClick={deleteCustomPrice}
                >
                  <TrashIcon size={20} className="text-grey-40" />
                </Button>
              </div>
            </div>
          ) : (
            <Button
              size="small"
              variant="secondary"
              type="button"
              className="h-10"
              onClick={setDefaultCustomPrice}
            >
              Add custom price
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

export default ReturnShippingForm
