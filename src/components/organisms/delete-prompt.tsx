import React, { useState } from "react"
import useMedusa from "../../hooks/use-medusa"
import { getErrorMessage } from "../../utils/error-messages"
import Button from "../fundamentals/button"
import Modal from "../molecules/modal"

type DeletePromptProps = {
  heading?: string
  text?: string
  successText?: string
  cancelText?: string
  confirmText?: string
  handleClose: () => void
  onDelete: () => Promise<void>
}

const DeletePrompt: React.FC<DeletePromptProps> = ({
  heading = "Are you sure?",
  text = "Are you sure you want to delete?",
  successText = "Delete successful",
  cancelText = "No, cancel",
  confirmText = "Yes, remove",
  handleClose,
  onDelete,
}) => {
  const { toaster } = useMedusa("store")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    setIsLoading(true)
    onDelete()
      .then(() => toaster(successText, "success"))
      .catch((err) => toaster(getErrorMessage(err), "error"))
      .finally(() => {
        setIsLoading(false)
        handleClose()
      })
  }

  return (
    <Modal isLargeModal={false} handleClose={handleClose}>
      <Modal.Body>
        <Modal.Content>
          <div className="flex flex-col">
            <span className="inter-large-semibold">{heading}</span>
            <span className="inter-base-regular mt-1 text-grey-50">{text}</span>
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="flex w-full h-8 justify-end">
            <Button
              variant="ghost"
              className="mr-2 w-24 text-small justify-center"
              size="small"
              onClick={handleClose}
            >
              {cancelText}
            </Button>
            <Button
              loading={isLoading}
              size="small"
              className="w-24 text-small justify-center"
              variant="danger"
              onClick={handleSubmit}
            >
              {confirmText}
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default DeletePrompt
