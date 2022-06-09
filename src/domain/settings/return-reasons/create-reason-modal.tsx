import { ReturnReason } from "@medusajs/medusa"
import { useAdminCreateReturnReason } from "medusa-react"
import React from "react"
import { useForm } from "react-hook-form"
import Button from "../../../components/fundamentals/button"
import Input from "../../../components/molecules/input"
import Modal from "../../../components/molecules/modal"
import useNotification from "../../../hooks/use-notification"

type CreateReturnReasonModalProps = {
  handleClose: () => void
  initialReason?: ReturnReason
}

type CreateReturnReasonFormData = {
  value: string
  label: string
  description: string | null
}

// the reason props is used for prefilling the form when duplicating
const CreateReturnReasonModal = ({
  handleClose,
  initialReason,
}: CreateReturnReasonModalProps) => {
  const { register, handleSubmit } = useForm<CreateReturnReasonFormData>({
    defaultValues: {
      value: initialReason?.value,
      label: initialReason?.label,
      description: initialReason?.description,
    },
  })
  const notification = useNotification()
  const { mutate, isLoading } = useAdminCreateReturnReason()

  const onCreate = (data: CreateReturnReasonFormData) => {
    mutate(
      {
        ...data,
        description: data.description || undefined,
      },
      {
        onSuccess: () => {
          notification("Success", "Created a new return reason", "success")
        },
        onError: () => {
          notification(
            "Error",
            "Cant create a Return reason with an existing code",
            "error"
          )
        },
      }
    )
    handleClose()
  }

  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <span className="inter-xlarge-semibold">Add Reason</span>
        </Modal.Header>
        <form onSubmit={handleSubmit(onCreate)}>
          <Modal.Content>
            <div className="flex">
              <Input
                {...register("value", { required: true })}
                label="Value"
                placeholder="wrong_size"
              />
              <Input
                className="ml-base"
                {...register("label", { required: true })}
                label="Label"
                placeholder="Wrong size"
              />
            </div>
            <Input
              className="mt-large"
              {...register("description")}
              label="Description"
              placeholder="Customer received the wrong size"
            />
          </Modal.Content>
          <Modal.Footer>
            <div className="flex w-full h-8 justify-end">
              <Button
                variant="ghost"
                className="mr-2 w-32 text-small justify-center"
                size="large"
                onClick={handleClose}
                type="button"
              >
                Cancel
              </Button>
              <Button
                loading={isLoading}
                size="large"
                className="w-32 text-small justify-center"
                variant="primary"
              >
                Create
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

export default CreateReturnReasonModal
