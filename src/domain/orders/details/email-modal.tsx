import React from "react"
import { useForm } from "react-hook-form"

import Button from "../../../components/fundamentals/button"
import Input from "../../../components/molecules/input"
import Modal from "../../../components/molecules/modal"

type EmailModalProps = {
  handleClose: () => void
  handleSave: ({ email: string }) => Promise<void>
  email?: string
}

const EmailModal: React.FC<EmailModalProps> = ({
  email,
  handleClose,
  handleSave,
}) => {
  const { register, handleSubmit } = useForm({
    defaultValues: { email },
  })

  const submit = (data) => {
    return handleSave(data)
  }

  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <span className="inter-xlarge-semibold">Email Address</span>
        </Modal.Header>
        <Modal.Content>
          <div className="space-y-4">
            <div className="flex mt-4 space-x-4">
              <Input
                label="Email"
                name="email"
                ref={register}
                placeholder="Email"
              />
            </div>
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

export default EmailModal
