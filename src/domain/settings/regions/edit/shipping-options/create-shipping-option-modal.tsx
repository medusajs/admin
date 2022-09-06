import { useAdminCreateShippingOption } from "medusa-react"
import React from "react"
import { useForm } from "react-hook-form"
import Button from "../../../../../components/fundamentals/button"
import Modal from "../../../../../components/molecules/modal"
import { ShippingOptionFormType } from "../../components/shipping-option-form"

type Props = {
  open: boolean
  onClose: () => void
}

const CreateShippingOptionModal = ({ open, onClose }: Props) => {
  const form = useForm<ShippingOptionFormType>()
  const {
    formState: { isDirty },
    handleSubmit,
    reset,
  } = form
  const { mutate } = useAdminCreateShippingOption()

  const closeAndReset = () => {
    reset()
    onClose()
  }

  return (
    <Modal open={open} handleClose={closeAndReset}>
      <Modal.Body>
        <Modal.Header handleClose={closeAndReset}></Modal.Header>
        <Modal.Content></Modal.Content>
        <Modal.Footer>
          <div className="w-full flex items-center gap-x-xsmall justify-end">
            <Button
              variant="secondary"
              size="small"
              type="button"
              onClick={closeAndReset}
            >
              Cancel
            </Button>
            <Button variant="primary" size="small" type="submit">
              Save and close
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default CreateShippingOptionModal
