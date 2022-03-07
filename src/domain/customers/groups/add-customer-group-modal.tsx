import React from "react"

import Modal from "../../../components/molecules/modal"
import Input from "../../../components/molecules/input"
import Button from "../../../components/fundamentals/button"
import { useForm } from "react-hook-form"

type P = {
  handleClose: () => void
  handleSave: (data: { data: { name: string } }) => void
}

function AddCustomerGroupModal(p: P) {
  const { handleClose, handleSave } = p

  const { register, handleSubmit } = useForm()

  const submit = (data) => {
    return handleSave({ data })
  }

  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <span className="inter-xlarge-semibold">
            Create New Customer Group
          </span>
        </Modal.Header>
        <Modal.Content>
          <div className="space-y-4">
            <span className="inter-base-semibold">Details</span>
            <div className="flex space-x-4">
              <Input
                label="Title"
                name="name"
                placeholder="Customer group name"
                required
                ref={register}
              />
            </div>
          </div>
          <div className="space-y-4 mt-8">
            <span className="inter-base-semibold">Metadata</span>
            <div className="flex space-x-4">...</div>
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="flex w-full h-8 justify-end">
            <Button
              variant="ghost"
              className="mr-2 w-32 text-small justify-center"
              size="large"
              onClick={handleClose}
            >
              Cancel
            </Button>
            <Button
              size="large"
              className="w-32 text-small justify-center"
              variant="primary"
              onClick={handleSubmit(submit)}
            >
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default AddCustomerGroupModal
