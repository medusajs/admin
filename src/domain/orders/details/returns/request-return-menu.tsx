import { Order } from "@medusajs/medusa"
import { useAdminRequestReturn } from "medusa-react"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import Button from "../../../../components/fundamentals/button"
import Modal from "../../../../components/molecules/modal"
import LayeredModal, {
  useLayeredModal,
} from "../../../../components/molecules/modal/layered-modal"
import { nestedForm } from "../../../../utils/nested-form"
import ItemsToReturnForm, {
  ItemsToReturnFormType,
} from "../../components/items-to-return-form"
import ReceiveNowForm, {
  ReceiveNowFormType,
} from "../../components/receive-now-form"
import ReturnShippingForm, {
  ReturnShippingFormType,
} from "../../components/return-shipping-form"
import SendNotificationForm, {
  SendNotificationFormType,
} from "../../components/send-notification-form"
import { getDefaultRequestReturnValues } from "../utils/get-default-values"

type Props = {
  open: boolean
  onClose: () => void
  order: Order
}

export type RequestReturnFormType = {
  notification: SendNotificationFormType
  return_items: ItemsToReturnFormType
  return_shipping: ReturnShippingFormType
  receive: ReceiveNowFormType
  refund: number
}

const RequestReturnMenu = ({ order, open, onClose }: Props) => {
  const context = useLayeredModal()
  const { mutate } = useAdminRequestReturn(order.id)

  const form = useForm<RequestReturnFormType>({
    defaultValues: getDefaultRequestReturnValues(order),
  })
  const { handleSubmit, reset } = form

  useEffect(() => {
    reset(getDefaultRequestReturnValues(order))
    context.reset()
  }, [open, order])

  const onSubmit = handleSubmit((data) => {
    mutate({
      items: data.return_items.items.map((i) => ({
        item_id: i.item_id,
        quantity: i.quantity,
        note: i.return_reason_details.note,
        reason_id: i.return_reason_details.reason?.value,
      })),
      no_notification: !data.notification.send_notification,
      receive_now: data.receive.receive_now,
      refund: data.refund,
      return_shipping: {
        option_id: data.return_shipping.option?.value,
        price: data.return_shipping.price,
      },
    })
  })

  return (
    <LayeredModal
      open={open}
      handleClose={onClose}
      context={context}
      isLargeModal
    >
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          <h1 className="inter-xlarge-semibold">Request Return</h1>
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
          <div className="flex items-center w-full justify-between">
            <div className="flex items-center gap-x-xlarge w-full">
              <SendNotificationForm
                form={nestedForm(form, "notification")}
                type="return"
              />
              <ReceiveNowForm form={nestedForm(form, "receive")} />
            </div>
            <div className="flex w-full items-center justify-end gap-x-xsmall">
              <Button variant="secondary" size="small">
                Cancel
              </Button>
              <Button variant="primary" size="small">
                Submit and close
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </LayeredModal>
  )
}

export default RequestReturnMenu
