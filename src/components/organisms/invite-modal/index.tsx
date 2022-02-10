import React, { useState } from "react"
import useNotification from "../../../hooks/use-notification"
import Medusa from "../../../services/api"
import Button from "../../fundamentals/button"
import InputField from "../../molecules/input"
import Modal from "../../molecules/modal"

type InviteModalProps = {
  handleClose: () => void
}

const InviteModal: React.FC<InviteModalProps> = ({ handleClose }) => {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [role, setRole] = useState("member")
  const notification = useNotification()

  const handleSubmit = (e) => {
    e.preventDefault()

    setIsLoading(true)

    const values = {
      user: email,
      role,
    }

    Medusa.invites
      .create(values)
      .then((_res) => {
        setIsLoading(false)
        handleClose()
        notification("Success", "user(s) invited", "success")
      })
      .catch((_error) => {
        setIsLoading(false)
        notification("Error", "Could not add user(s)", "error")
        handleClose()
      })
  }

  return (
    <Modal handleClose={handleClose}>
      <Modal.Body>
        <Modal.Header handleClose={handleClose}>
          <span className="inter-xlarge-semibold">Invite Users</span>
        </Modal.Header>
        <Modal.Content>
          <InputField
            label="Email"
            placeholder="lebron@james.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
              loading={isLoading}
              size="large"
              className="w-32 text-small justify-center"
              variant="primary"
              onClick={handleSubmit}
            >
              Invite
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default InviteModal
