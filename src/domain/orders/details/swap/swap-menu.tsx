import { Order } from "@medusajs/medusa"
import { useAdminCreateSwap, useAdminOrder } from "medusa-react"
import React, { useEffect, useMemo } from "react"
import { useForm, useWatch } from "react-hook-form"
import Button from "../../../../components/fundamentals/button"
import IconTooltip from "../../../../components/molecules/icon-tooltip"
import Modal from "../../../../components/molecules/modal"
import LayeredModal, {
  useLayeredModal,
} from "../../../../components/molecules/modal/layered-modal"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"
import { nestedForm } from "../../../../utils/nested-form"
import { formatAmountWithSymbol } from "../../../../utils/prices"
import ItemsToReturnForm, {
  ItemsToReturnFormType,
} from "../../components/items-to-return-form"
import ItemsToSendForm, {
  ItemsToSendFormType,
} from "../../components/items-to-send-form"
import ReturnShippingForm, {
  ReturnShippingFormType,
} from "../../components/return-shipping-form"
import SendNotificationForm, {
  SendNotificationFormType,
} from "../../components/send-notification-form"
import { getDefaultSwapValues } from "../utils/get-default-values"

type Props = {
  onClose: () => void
  open: boolean
  order: Order
}

export type CreateSwapFormType = {
  notification: SendNotificationFormType
  return_items: ItemsToReturnFormType
  additional_items: ItemsToSendFormType
  return_shipping: ReturnShippingFormType
}

const SwapMenu = ({ order, onClose, open }: Props) => {
  const context = useLayeredModal()
  const notification = useNotification()

  const { refetch } = useAdminOrder(order.id)
  const { mutate, isLoading: isMutating } = useAdminCreateSwap(order.id)

  const form = useForm<CreateSwapFormType>({
    defaultValues: getDefaultSwapValues(order),
  })
  const { handleSubmit, reset } = form

  useEffect(() => {
    reset(getDefaultSwapValues(order))
    context.reset()
  }, [open, order])

  const onSubmit = handleSubmit((data) => {
    mutate(
      {
        return_items: data.return_items.items.map((ri) => ({
          item_id: ri.item_id,
          quantity: ri.quantity,
          note: ri.return_reason_details.note,
          reason_id: ri.return_reason_details.reason?.value,
        })),
        additional_items: data.additional_items.items.map((ai) => ({
          quantity: ai.quantity,
          variant_id: ai.variant_id,
        })),
        no_notification: !data.notification.send_notification,
        return_shipping: {
          option_id: data.return_shipping.option!.value,
          price: data.return_shipping.price,
        },
      },
      {
        onSuccess: () => {
          notification("Success", "Successfully created exchange", "success")
          refetch()
          onClose()
        },
        onError: (error) => {
          notification("Error", getErrorMessage(error), "error")
        },
      }
    )
  })

  const watchedReturnItems = useWatch({
    control: form.control,
    name: "return_items.items",
  })

  const watchedAdditionalItems = useWatch({
    control: form.control,
    name: "additional_items.items",
  })

  const returnItemsTotal = watchedReturnItems
    .filter((ri) => ri.return)
    .reduce((acc, item) => {
      const refundableAmount =
        ((item.refundable || 0) / item.quantity) * item.quantity

      return acc + refundableAmount
    }, 0)

  const additionalItemsTotal = useMemo(() => {
    return watchedAdditionalItems.reduce((acc, item) => {
      return acc + item.quantity * item.price
    }, 0)
  }, [watchedAdditionalItems])

  const watchedShippingPrice = useWatch({
    control: form.control,
    name: "return_shipping.price",
  })

  return (
    <LayeredModal context={context} open={open} handleClose={onClose}>
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          <h1 className="inter-xlarge-semibold">Register Exchange</h1>
        </Modal.Header>
        <Modal.Content>
          <div className="flex flex-col gap-y-xlarge">
            <ItemsToReturnForm
              form={nestedForm(form, "return_items")}
              order={order}
            />
            <ReturnShippingForm
              form={nestedForm(form, "return_shipping")}
              order={order}
            />
            <ItemsToSendForm
              form={nestedForm(form, "additional_items")}
              order={order}
            />
          </div>
          <div className="mt-xlarge">
            <div className="flex text-grey-90 justify-between items-center inter-small-regular">
              <span>Return total</span>
              <span>
                {formatAmountWithSymbol({
                  currency: order.currency_code,
                  amount: returnItemsTotal,
                })}
              </span>
            </div>
            <div className="flex text-grey-90 justify-between items-center inter-small-regular mt-xsmall">
              <span>Additional total</span>
              <span>
                {formatAmountWithSymbol({
                  currency: order.currency_code,
                  amount: additionalItemsTotal,
                })}
              </span>
            </div>
            <div className="flex text-grey-90 justify-between items-center inter-small-regular mt-xsmall">
              <div className="flex items-center gap-x-xsmall">
                <p>
                  Return shipping{" "}
                  <span className="text-grey-50">(excl. tax)</span>
                </p>
                <IconTooltip
                  size={16}
                  content={
                    "Note that applicable taxes will be added at checkout."
                  }
                />
              </div>
              <p>
                {formatAmountWithSymbol({
                  currency: order.currency_code,
                  amount: watchedShippingPrice || 0,
                })}
              </p>
            </div>
            <div className="flex text-grey-90 justify-between items-center inter-small-regular mt-xsmall">
              <span>Outbond shipping</span>
              <span>Calculated at checkout</span>
            </div>
            <div className="flex justify-between items-center inter-base-semibold mt-base">
              <span>Estimated difference</span>
              <span className="inter-large-semibold">
                {formatAmountWithSymbol({
                  currency: order.currency_code,
                  amount:
                    additionalItemsTotal -
                    returnItemsTotal -
                    (watchedShippingPrice || 0),
                })}
              </span>
            </div>
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="w-full flex items-center justify-between">
            <SendNotificationForm
              form={nestedForm(form, "notification")}
              type="swap"
            />
            <div className="flex items-center gap-x-xsmall">
              <Button
                variant="secondary"
                size="small"
                onClick={onClose}
                type="button"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="small"
                loading={isMutating}
                onClick={onSubmit}
              >
                Submit and close
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </LayeredModal>
  )
}

export default SwapMenu
