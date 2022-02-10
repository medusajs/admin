import React, { useState } from "react"
import useNotification from "../../../hooks/use-notification"
import Medusa from "../../../services/api"
import { getErrorMessage } from "../../../utils/error-messages"
import Button from "../../fundamentals/button"
import InputField from "../../molecules/input"
import Modal from "../../molecules/modal"

type EditUserModalProps = {
  handleClose: () => void
  user: {
    id: string
    first_name: string
    last_name: string
    email: string
  }
  onSubmit: () => void
}

const EditUserModal: React.FC<EditUserModalProps> = ({
  handleClose,
  user,
  onSubmit,
}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState(user.email)
  const [first_name, setFirstName] = useState(user.first_name)
  const [last_name, setLastName] = useState(user.last_name)
  const notification = useNotification()

  const submit = () => {
    setIsLoading(true)
    Medusa.users
      .update(user.id, {
        first_name,
        last_name,
      })
      .then((res) => onSubmit())
      .catch((err) => notification("Error", getErrorMessage(err), "error"))

    handleClose()
  }

  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <span className="inter-xlarge-semibold">Edit User</span>
        </Modal.Header>
        <Modal.Content>
          <div className="w-full flex mb-4">
            <InputField
              label="First Name"
              placeholder="First name..."
              onChange={(e) => setFirstName(e.target.value)}
              value={first_name}
              className="mr-4"
            />
            <InputField
              label="Last Name"
              placeholder="Last name..."
              onChange={(e) => setLastName(e.target.value)}
              value={last_name}
            />
          </div>
          <InputField label="Email" disabled value={email} />
        </Modal.Content>
        <Modal.Footer>
          <div className="w-full flex justify-end">
            <Button
              variant="ghost"
              size="small"
              onClick={handleClose}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              loading={isLoading}
              variant="primary"
              size="small"
              onClick={submit}
            >
              Save
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default EditUserModal
