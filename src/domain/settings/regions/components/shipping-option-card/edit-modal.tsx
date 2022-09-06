import { ShippingOption } from "@medusajs/medusa"
import React from "react"
import { useForm } from "react-hook-form"
import Button from "../../../../../components/fundamentals/button"
import Modal from "../../../../../components/molecules/modal"
import fulfillmentProvidersMapper from "../../../../../utils/fulfillment-providers.mapper"
import ShippingOptionForm, {
  ShippingOptionFormType,
} from "../shipping-option-form"

type Props = {
  open: boolean
  onClose: () => void
  option: ShippingOption
}

const EditModal = ({ open, onClose, option }: Props) => {
  const form = useForm<ShippingOptionFormType>({
    defaultValues: getDefaultValues(option),
  })

  return (
    <Modal open={open} handleClose={onClose}>
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          <h1 className="inter-xlarge-semibold">Edit Shipping Option</h1>
        </Modal.Header>
        <Modal.Content>
          <ShippingOptionForm form={form} region={option.region} />
        </Modal.Content>
        <Modal.Footer>
          <div className="flex items-center gap-x-xsmall justify-end w-full">
            <Button variant="secondary" size="small">
              Cancel
            </Button>
            <Button variant="primary" size="small">
              Cancel
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

const getDefaultValues = (option: ShippingOption): ShippingOptionFormType => {
  return {
    store_option: option.admin_only ? false : true,
    name: option.name,
    fulfillment_provider: option.provider_id
      ? fulfillmentProvidersMapper(option.provider_id)
      : null,
    shipping_profile: option.profile
      ? { value: option.profile.id, label: option.profile.name }
      : null,
    requirements: {
      min_subtotal:
        option.requirements.find((r) => r.type === "min_subtotal")?.amount ||
        null,
      max_subtotal:
        option.requirements.find((r) => r.type === "max_subtotal")?.amount ||
        null,
    },
  }
}

export default EditModal
