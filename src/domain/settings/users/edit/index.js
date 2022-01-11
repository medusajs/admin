import React, { useState } from "react"
import Button from "../../../../components/fundamentals/button"
import Modal from "../../../../components/molecules/modal"
import InputField from "../../../../components/molecules/input"
import Medusa from "../../../../services/api"
import useMedusa from "../../../../hooks/use-medusa"
import { getErrorMessage } from "../../../../utils/error-messages"

const decideBadgeColor = email_status => {
  switch (!email_status) {
    case "verified":
      return {
        bg: "#4BB543",
        color: "white",
      }
    default:
      return {
        bg: "#e3e8ee",
        color: "#4f566b",
      }
  }
}

const EditUser = ({ handleClose, user, onSubmit }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [email, setEmail] = useState(user.email)
  const [first_name, setFirstName] = useState(user.first_name)
  const [last_name, setLastName] = useState(user.last_name)
  const { toaster } = useMedusa("store")

  const submit = () => {
    setIsLoading(true)
    Medusa.users
      .update(user.id, {
        first_name,
        last_name,
      })
      .then(res => res.data)
      .then(data => {
        onSubmit(data)
      })
      .catch(err => console.log(err)) //toaster(getErrorMessage(err), "error"))

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
              onChange={e => setFirstName(e.target.value)}
              value={first_name}
              className="mr-4"
            />
            <InputField
              label="Last Name"
              onChange={e => setLastName(e.target.value)}
              value={last_name}
            />
          </div>
          <InputField label="Email" value={email} />
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

export default EditUser
