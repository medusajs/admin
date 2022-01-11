import React, { useState } from "react"
import Modal from "../molecules/modal"
import Button from "../fundamentals/button"
import useMedusa from "../../hooks/use-medusa"
import { getErrorMessage } from "../../utils/error-messages"

type DeletePromptProps = {
  heading: string
  text: string
  successText?: string
  handleClose: () => void
  onDelete: () => Promise<void>
}

const DeletePrompt: React.FC<DeletePromptProps> = ({
  heading,
  text,
  successText,
  handleClose,
  onDelete,
}) => {
  const { toaster } = useMedusa("store")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = e => {
    e.preventDefault()

    setIsLoading(true)
    onDelete()
      .then(() => toaster(successText || "Delete successful", "success"))
      .catch(err => toaster(getErrorMessage(err), "error"))
      .finally(() => {
        setIsLoading(false)
        handleClose()
      })
  }

  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Content>
          <div className="flex flex-col">
            <span className="inter-large-semibold">
              {heading || "Are you sure?"}
            </span>
            <span className="inter-base-regular mt-1 text-grey-50">
              {text || "Are you sure you want to delete?"}
            </span>
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
              No, cancel
            </Button>
            <Button
              loading={isLoading}
              size="small"
              className="w-24 text-small justify-center"
              variant="danger"
              onClick={handleSubmit}
            >
              Yes, remove
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default DeletePrompt
