import { Order } from "@medusajs/medusa"
import { useAdminCreateSwap, useAdminOrder } from "medusa-react"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import Button from "../../../../components/fundamentals/button"
import Modal from "../../../../components/molecules/modal"
import LayeredModal, {
  useLayeredModal,
} from "../../../../components/molecules/modal/layered-modal"
import useNotification from "../../../../hooks/use-notification"
import { getErrorMessage } from "../../../../utils/error-messages"
import { nestedForm } from "../../../../utils/nested-form"
import ItemsToReturnForm, {
  ItemsToReturnFormType,
} from "../../components/items-to-return-form"
import ReturnShippingForm, {
  ReturnShippingFormType,
} from "../../components/return-shipping-form"
import SendNotificationForm, {
  SendNotificationFormType,
} from "../../components/send-notification-form"

type Props = {
  onClose: () => void
  open: boolean
  order: Order
}

type AdditionalItem = {
  quantity: number
  variant_id: string
}

type CreateSwapFormType = {
  notification: SendNotificationFormType
  return_items: ItemsToReturnFormType
  additional_items: AdditionalItem[]
  return_shipping: ReturnShippingFormType
}

const SwapMenu = ({ order, onClose, open }: Props) => {
  const context = useLayeredModal()
  const notification = useNotification()

  const { refetch } = useAdminOrder(order.id)
  const { mutate, isLoading: isMutating } = useAdminCreateSwap(order.id)

  const form = useForm<CreateSwapFormType>({
    defaultValues: getDefaultValues(order),
  })
  const { control, handleSubmit, reset } = form

  useEffect(() => {
    reset(getDefaultValues(order))
  }, [open, order])

  const onSubmit = handleSubmit((data) => {
    mutate(
      {
        return_items: data.return_items.items.map((ri) => ({
          item_id: ri.item_id,
          quantity: ri.quantity,
          note: ri.return_reason_details.note,
          reason: ri.return_reason_details.reason?.value,
        })),
        additional_items: data.additional_items,
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
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="w-full flex items-center justify-between">
            <SendNotificationForm form={nestedForm(form, "notification")} />
            <div className="flex items-center gap-x-xsmall">
              <Button
                variant="secondary"
                size="small"
                onClick={onClose}
                type="button"
              >
                Cancel
              </Button>
              <Button variant="primary" size="small" loading={isMutating}>
                Submit and close
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </LayeredModal>
  )
}

const getDefaultValues = (order: Order): CreateSwapFormType => {
  return {
    return_items: {
      items: order.items.map((item) => ({
        item_id: item.id,
        thumbnail: item.thumbnail,
        refundable: item.refundable,
        product_title: item.variant.product.title,
        variant_title: item.variant.title,
        quantity: item.quantity,
        return_reason_details: {
          note: undefined,
          reason: undefined,
        },
        return: false,
      })),
    },
    additional_items: [],
    return_shipping: {
      option: null,
    },
    notification: {
      send_notification: true,
    },
  }
}

export default SwapMenu
