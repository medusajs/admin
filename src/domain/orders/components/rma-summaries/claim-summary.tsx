import { Order } from "@medusajs/medusa"
import clsx from "clsx"
import { useMemo } from "react"
import { UseFormReturn, useWatch } from "react-hook-form"
import IconTooltip from "../../../../components/molecules/icon-tooltip"
import { nestedForm } from "../../../../utils/nested-form"
import { formatAmountWithSymbol } from "../../../../utils/prices"
import { CreateClaimFormType } from "../../details/claim/register-claim-menu"
import RefundAmountForm from "../refund-amount-form"
import { SummaryLineItem } from "./summary-line-item"
import { SummaryShippingLine } from "./summary-shipping-line"

type Props = {
  form: UseFormReturn<CreateClaimFormType, any>
  order: Order
}

export const ClaimSummary = ({ form, order }: Props) => {
  const { control } = form

  const claimItems = useWatch({
    control: control,
    name: "return_items",
    defaultValue: {
      items: [],
    },
  })

  const selectedClaimItems = useMemo(() => {
    return claimItems.items.filter((item) => item.return)
  }, [claimItems])

  const claimItemShipping = useWatch({
    control: control,
    name: "return_shipping",
  })

  const replacementItems = useWatch({
    control: control,
    name: "additional_items.items",
    defaultValue: [],
  })

  const replacementItemShipping = useWatch({
    control: control,
    name: "replacement_shipping",
  })

  const claimType = useWatch({
    control: control,
    name: "claim_type",
  })

  const refundAmount = useMemo(() => {
    const claimItemsRefund = selectedClaimItems.reduce((acc, item) => {
      return acc + (item.total / item.original_quantity) * item.quantity
    }, 0)

    const replacementItemsCost = replacementItems.reduce((acc, item) => {
      return acc + item.price * item.quantity
    }, 0)

    const refundTotal =
      claimType.type === "refund"
        ? claimItemsRefund
        : claimItemsRefund -
          replacementItemsCost -
          (replacementItemShipping?.price ?? 0)

    return {
      claimedItems: formatAmountWithSymbol({
        amount: claimItemsRefund,
        currency: order.currency_code,
      }),
      replacementItems: formatAmountWithSymbol({
        amount: replacementItemsCost,
        currency: order.currency_code,
      }),
      replacementShipping: replacementItemShipping?.price
        ? formatAmountWithSymbol({
            amount: replacementItemShipping.price,
            currency: order.currency_code,
          })
        : "Free",
      total: formatAmountWithSymbol({
        amount: refundTotal,
        currency: order.currency_code,
      }),
      actualTotal:
        refundTotal < 0
          ? formatAmountWithSymbol({
              amount: 0,
              currency: order.currency_code,
            })
          : formatAmountWithSymbol({
              amount: refundTotal,
              currency: order.currency_code,
            }),
      actualTotalAsNumber: refundTotal < 0 ? 0 : refundTotal,
      isNegative: refundTotal < 0,
    }
  }, [
    selectedClaimItems,
    replacementItems,
    claimType.type,
    replacementItemShipping.price,
    order.currency_code,
  ])

  if (!(selectedClaimItems.length > 0 || replacementItems.length > 0)) {
    return null
  }

  return (
    <div className="inter-base-regular">
      <div className="flex flex-col gap-y-base border-y border-grey-20 py-large">
        {selectedClaimItems.length > 0 && (
          <div>
            <p className="inter-base-semibold mb-small">Claimed items</p>
            <div className="flex flex-col gap-y-xsmall">
              {selectedClaimItems.map((item, index) => {
                return (
                  <SummaryLineItem
                    key={index}
                    currencyCode={order.currency_code}
                    productTitle={item.product_title}
                    quantity={item.quantity}
                    price={item.total / item.original_quantity}
                    total={
                      (item.total / item.original_quantity) * item.quantity
                    }
                    variantTitle={item.variant_title}
                    thumbnail={item.thumbnail}
                  />
                )
              })}
              {claimItemShipping.option && (
                <SummaryShippingLine
                  currencyCode={order.currency_code}
                  price={claimItemShipping.price}
                  title={claimItemShipping.option.label}
                  type="return"
                />
              )}
            </div>
          </div>
        )}
        {replacementItems.length > 0 && (
          <div>
            <p className="inter-base-semibold mb-small">Replacement items</p>
            <div className="flex flex-col gap-y-xsmall">
              {replacementItems.map((item, index) => {
                return (
                  <SummaryLineItem
                    key={index}
                    currencyCode={order.currency_code}
                    productTitle={item.product_title}
                    quantity={item.quantity}
                    price={item.price}
                    total={item.price * item.quantity}
                    variantTitle={item.variant_title}
                    thumbnail={item.thumbnail}
                    isFree
                  />
                )
              })}
              {replacementItemShipping?.option && (
                <SummaryShippingLine
                  currencyCode={order.currency_code}
                  price={replacementItemShipping.price}
                  title={replacementItemShipping.option.label}
                  type="replacement"
                />
              )}
            </div>
          </div>
        )}
      </div>
      <div className="flex flex-col gap-y-xsmall pt-large">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-x-xsmall">
            <p>Difference</p>
            {refundAmount.isNegative && (
              <div data-testid="negative-difference-tooltip">
                <IconTooltip
                  type="warning"
                  side="top"
                  content={
                    "Customers cannot make supplementary payments for claims. To account for differences in item cost, create an exchange instead."
                  }
                />
              </div>
            )}
          </div>
          <p
            className={clsx({
              "text-rose-50": refundAmount.isNegative,
              "text-emerald-50":
                !refundAmount.isNegative &&
                refundAmount.actualTotalAsNumber > 0,
            })}
          >
            {refundAmount.total}
          </p>
        </div>
        <div
          className="inter-large-semibold flex items-center justify-between"
          data-testid="refund-amount-container"
        >
          <p className="inter-base-semibold">Refund amount</p>
          <div className="flex items-center">
            {claimType.type === "refund" ? (
              <RefundAmountForm
                form={nestedForm(form, "refund_amount")}
                order={order}
                initialValue={refundAmount.actualTotalAsNumber}
              />
            ) : (
              <p>{refundAmount.actualTotal}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
