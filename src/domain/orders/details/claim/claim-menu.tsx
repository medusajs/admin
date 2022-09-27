import { ClaimReason, Order } from "@medusajs/medusa"
import { useAdminCreateClaim } from "medusa-react"
import React, { useEffect } from "react"
import { useForm, useWatch } from "react-hook-form"
import Button from "../../../../components/fundamentals/button"
import Modal from "../../../../components/molecules/modal"
import LayeredModal, {
  useLayeredModal,
} from "../../../../components/molecules/modal/layered-modal"
import { AddressPayload } from "../../../../components/templates/address-form"
import { nestedForm } from "../../../../utils/nested-form"
import ClaimTypeForm, {
  ClaimTypeFormType,
} from "../../components/claim-type-form"
import ItemsToReturnForm, {
  ItemsToReturnFormType,
} from "../../components/items-to-return-form"
import ItemsToSendForm, {
  ItemsToSendFormType,
} from "../../components/items-to-send-form"
import ReplacementShippingForm, {
  ReplacementShippingFormType,
} from "../../components/replacement-shipping-form"
import ReturnShippingForm, {
  ReturnShippingFormType,
} from "../../components/return-shipping-form"
import SendNotificationForm, {
  SendNotificationFormType,
} from "../../components/send-notification-form"
import ShippingAddressForm from "../../components/shipping-address-form"
import { getDefaultClaimValues } from "../utils/get-default-values"

export type CreateClaimFormType = {
  notification: SendNotificationFormType
  return_items: ItemsToReturnFormType
  additional_items: ItemsToSendFormType
  return_shipping: ReturnShippingFormType
  replacement_shipping: ReplacementShippingFormType
  shipping_address: AddressPayload
  claim_type: ClaimTypeFormType
}

type Props = {
  order: Order
  open: boolean
  onClose: () => void
}

const ClaimMenu = ({ order, open, onClose }: Props) => {
  const context = useLayeredModal()
  const { mutate } = useAdminCreateClaim(order.id)

  const form = useForm<CreateClaimFormType>({
    defaultValues: getDefaultClaimValues(order),
  })
  const { handleSubmit, reset } = form

  useEffect(() => {
    reset(getDefaultClaimValues(order))
    context.reset()
  }, [open, order])

  const onSubmit = handleSubmit((data) => {
    mutate({
      claim_items: data.return_items.items.map((item) => ({
        item_id: item.item_id,
        quantity: item.quantity,
        note: item.return_reason_details.note,
        reason: item.return_reason_details.reason?.value as ClaimReason,
      })),
      type: "refund",
    })
  })

  const watchedType = useWatch({
    control: form.control,
    name: "claim_type.type",
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
          <h1 className="inter-xlarge-semibold">Create Claim</h1>
        </Modal.Header>
        <Modal.Content>
          <div className="flex flex-col gap-y-xlarge">
            <ItemsToReturnForm
              form={nestedForm(form, "return_items")}
              order={order}
              isClaim={true}
            />
            <ReturnShippingForm
              form={nestedForm(form, "return_shipping")}
              order={order}
            />
            <ClaimTypeForm form={nestedForm(form, "claim_type")} />
            {watchedType === "replace" && (
              <>
                <ItemsToSendForm
                  form={nestedForm(form, "additional_items")}
                  order={order}
                />
                <ShippingAddressForm
                  form={nestedForm(form, "shipping_address")}
                  order={order}
                />
                <ReplacementShippingForm
                  form={nestedForm(form, "replacement_shipping")}
                  order={order}
                />
              </>
            )}
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="w-full flex items-center justify-between">
            <SendNotificationForm
              form={nestedForm(form, "notification")}
              type="claim"
            />
            <div className="items-center flex justify-end gap-x-xsmall">
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

export default ClaimMenu
