import { Region } from "@medusajs/medusa"
import { useAdminCreateShippingOption } from "medusa-react"
import React from "react"
import { useForm } from "react-hook-form"
import Button from "../../../../../components/fundamentals/button"
import Modal from "../../../../../components/molecules/modal"
import ShippingOptionForm, {
  ShippingOptionFormType,
} from "../../components/shipping-option-form"

type Props = {
  open: boolean
  onClose: () => void
  region: Region
}

const CreateReturnShippingOptionModal = ({ open, onClose, region }: Props) => {
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

  const onSubmit = handleSubmit((data) => {
    // mutate({
    //     is_return: true,
    //     region_id: region.id,
    //     name: data.name!,
    // })
  })

  return (
    <Modal open={open} handleClose={closeAndReset}>
      <Modal.Body>
        <Modal.Header handleClose={closeAndReset}></Modal.Header>
        <form>
          <Modal.Content>
            <ShippingOptionForm form={form} region={region} />
          </Modal.Content>
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
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default CreateReturnShippingOptionModal
