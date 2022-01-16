import { useAdminCreateReturnReason } from "medusa-react"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import Button from "../../../components/fundamentals/button"
import Input from "../../../components/molecules/input"
import Modal from "../../../components/molecules/modal"
import useToaster from "../../../hooks/use-toaster"

// the reason props is used for prefilling the form when duplicating
const CreateReturnReasonModal = ({ handleClose, reason }) => {
  const { register, handleSubmit, reset } = useForm()
  const toaster = useToaster()
  const createRR = useAdminCreateReturnReason()

  useEffect(() => {
    reset({
      value: reason.value,
      label: reason.label,
      description: reason.description
    })
  }, [reason])

  const onCreate = async data => {
    await createRR.mutateAsync(data, {
      onSuccess: () => {
        toaster("Created a new return reason", "success")
      },
      onError: () => {
        toaster("Cant create a Return reason with an existing code", "error")
      },
    })
    handleClose()
  }

  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <span className="inter-xlarge-semibold">Add Reason</span>
        </Modal.Header>
        <Modal.Content>
          <div className="flex">
            <Input ref={register} name="value" label="Value" />
            <Input
              className="ml-base"
              ref={register}
              name="label"
              label="Label"
            />
          </div>
          <Input
            className="mt-large"
            ref={register}
            name="description"
            label="Description"
          />
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
              loading={createRR.isLoading}
              size="large"
              className="w-32 text-small justify-center"
              variant="primary"
              onClick={handleSubmit(onCreate)}
            >
              Create
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default CreateReturnReasonModal
