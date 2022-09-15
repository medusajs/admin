import { Order } from "@medusajs/medusa"
import { useAdminShippingOptions } from "medusa-react"
import React, { useMemo } from "react"
import { Controller, useWatch } from "react-hook-form"
import Button from "../../../../../components/fundamentals/button"
import TrashIcon from "../../../../../components/fundamentals/icons/trash-icon"
import { NextSelect } from "../../../../../components/molecules/select/next-select"
import { Option } from "../../../../../types/shared"
import { NestedForm } from "../../../../../utils/nested-form"

type ReturnShippingFormType = {
  option: Option | null
  price?: number
}

type Props = {
  form: NestedForm<ReturnShippingFormType>
  order: Order
}

const ReturnShippingForm = ({ form, order }: Props) => {
  const { control, path, setValue } = form

  const {
    shipping_options: returnOptions,
    isLoading: isLoadingReturnOptions,
  } = useAdminShippingOptions({
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

  return (
    <div>
      <h2>Shipping</h2>
      <Controller
        control={control}
        name={path("option")}
        render={({ field: { value, onChange, onBlur } }) => {
          return (
            <NextSelect
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
          {selectedReturnOptionPrice ? (
            <div className="flex items-center gap-x-xsmall">
              <Button
                variant="secondary"
                size="small"
                className="w-10 h-10 flex items-center justify-center"
              >
                <TrashIcon size={20} className="text-grey-40" />
              </Button>
            </div>
          ) : (
            <Button size="small" variant="secondary">
              Add custom price
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
