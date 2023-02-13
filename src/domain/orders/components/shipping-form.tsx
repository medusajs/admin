import { Order } from "@medusajs/medusa"
import { PricedShippingOption } from "@medusajs/medusa/dist/types/pricing"
import { useAdminShippingOptions } from "medusa-react"
import { useMemo } from "react"
import { Controller, useWatch } from "react-hook-form"
import Button from "../../../components/fundamentals/button"
import TrashIcon from "../../../components/fundamentals/icons/trash-icon"
import { NextSelect } from "../../../components/molecules/select/next-select"
import { NestedForm } from "../../../utils/nested-form"
import { formatAmountWithSymbol } from "../../../utils/prices"
import PriceFormInput from "../../products/components/prices-form/price-form-input"

export type ShippingFormType = {
  option: {
    label: string
    value: {
      id: string
      taxRate: number
    }
  } | null
  price?: number
}

type Props = {
  form: NestedForm<ShippingFormType>
  order: Order
  isReturn?: boolean
  isClaim?: boolean
  required?: boolean
}

const ShippingForm = ({
  form,
  order,
  isReturn = false,
  isClaim = false,
  required = false,
}: Props) => {
  const {
    control,
    path,
    setValue,
    formState: { errors },
  } = form

  const { shipping_options: returnOptions } = useAdminShippingOptions({
    region_id: order.region_id,
    is_return: isReturn,
  })

  const returnShippingOptions = useMemo(() => {
    return (
      returnOptions?.map((o) => ({
        label: o.name,
        value: {
          id: o.id,
          taxRate:
            (o as unknown as PricedShippingOption).tax_rates?.reduce(
              (acc, cur) => acc + (cur.rate || 0) / 100,
              0
            ) || 0,
        },
        suffix: (
          <span>
            {formatAmountWithSymbol({
              amount:
                (o as unknown as PricedShippingOption).price_incl_tax ||
                o.amount ||
                0,
              currency: order.currency_code,
            })}
          </span>
        ),
      })) || []
    )
  }, [order.currency_code, returnOptions])

  const selectedReturnOption = useWatch({
    control,
    name: path("option"),
  })

  const selectedReturnOptionPrice = useWatch({
    control,
    name: path("price"),
  })

  const setCustomPrice = () => {
    if (selectedReturnOption) {
      const option = returnOptions?.find(
        (ro) => ro.id === selectedReturnOption.value.id
      )

      setValue(
        path("price"),
        Math.round(
          (option?.amount || 0) * (1 + selectedReturnOption.value.taxRate)
        )
      )
    }
  }

  const deleteCustomPrice = () => {
    setValue(path("price"), undefined)
  }

  return (
    <div className="flex flex-col gap-y-base">
      <div className="flex flex-col">
        <h2 className="inter-base-semibold">
          Shipping for {isReturn ? "return" : "replacement"} items
        </h2>
        <ShippingFormHelpText isClaim={isClaim} isReturn={isReturn} />
      </div>
      <Controller
        control={control}
        name={path("option")}
        rules={{ required: required ? `Shipping method is required` : false }}
        render={({ field: { value, onChange, onBlur, ref, name } }) => {
          return (
            <NextSelect
              ref={ref}
              placeholder="Choose shipping method"
              label="Shipping method"
              name={name}
              options={returnShippingOptions}
              value={value}
              onChange={onChange}
              onBlur={onBlur}
              isClearable
            />
          )
        }}
      />
      {selectedReturnOption && !(isClaim && isReturn) && (
        <div className="flex w-full items-center justify-end">
          {selectedReturnOptionPrice !== undefined ? (
            <div className="flex w-full items-center justify-end">
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
                  className="flex h-10 w-10 items-center justify-center"
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
              onClick={setCustomPrice}
            >
              Add custom price
            </Button>
          )}
        </div>
      )}
    </div>
  )
}

const ShippingFormHelpText = ({
  isClaim = false,
  isReturn = false,
}: Pick<Props, "isClaim" | "isReturn">) => {
  const text = useMemo(() => {
    if (isClaim && isReturn) {
      return "Return shipping for items claimed by the customer due to a defect is complimentary."
    }

    if (!isReturn) {
      return "Replacement item shipping is complimentary by default. If otherwise, specify a custom shipping fee."
    }

    return undefined
  }, [isClaim, isReturn])

  if (!text) {
    return null
  }

  return <p className="inter-small-regular text-grey-50">{text}</p>
}

export default ShippingForm
