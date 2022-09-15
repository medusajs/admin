import { Order } from "@medusajs/medusa"
import { useAdminCreateSwap, useAdminOrder } from "medusa-react"
import React, { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import Checkbox from "../../../../components/atoms/checkbox"
import Button from "../../../../components/fundamentals/button"
import IconTooltip from "../../../../components/molecules/icon-tooltip"
import Modal from "../../../../components/molecules/modal"
import LayeredModal, {
  useLayeredModal,
} from "../../../../components/molecules/modal/layered-modal"
import useNotification from "../../../../hooks/use-notification"
import { Option } from "../../../../types/shared"
import { getErrorMessage } from "../../../../utils/error-messages"
import { nestedForm } from "../../../../utils/nested-form"
import ReturnShippingForm, {
  ReturnShippingFormType,
} from "../../components/return-shipping-form"

type Props = {
  onClose: () => void
  open: boolean
  order: Order
}

type ReturnItem = {
  item_id: string
  quantity: number
  note?: string
  reason?: Option
}

type AdditionalItem = {
  quantity: number
  variant_id: string
}

type CreateSwapFormType = {
  send_notifications: boolean
  return_items: ReturnItem[]
  additional_items: AdditionalItem[]
  return_shipping: ReturnShippingFormType
}

const CreateSwapModal = ({ order, onClose, open }: Props) => {
  const context = useLayeredModal()
  const notification = useNotification()

  const { refetch } = useAdminOrder(order.id)
  const { mutate, isLoading: isMutating } = useAdminCreateSwap(order.id)

  const form = useForm<CreateSwapFormType>()
  const { control, handleSubmit, reset } = form

  useEffect(() => {
    reset()
  }, [open])

  const onSubmit = handleSubmit((data) => {
    mutate(
      {
        return_items: data.return_items.map((ri) => ({
          item_id: ri.item_id,
          quantity: ri.quantity,
          note: ri.note,
          reason: ri.reason?.value,
        })),
        additional_items: data.additional_items,
        no_notification: !data.send_notifications,
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
          <ReturnShippingForm
            form={nestedForm(form, "return_shipping")}
            order={order}
          />
        </Modal.Content>
        <Modal.Footer>
          <div className="w-full flex items-center justify-between">
            <Controller
              control={control}
              name="send_notifications"
              render={({ field: { value, onChange } }) => {
                return (
                  <div className="flex items-center gap-x-xsmall">
                    <Checkbox
                      label="Send notifications"
                      checked={value}
                      onChange={onChange}
                    />
                    <IconTooltip
                      type="info"
                      content="If unchecked the customer will not receive communication about this exchange."
                    />
                  </div>
                )
              }}
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
              <Button variant="primary" size="small" loading={isMutating}>
                Submit
              </Button>
            </div>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </LayeredModal>
  )
}

export default CreateSwapModal
