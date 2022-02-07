import React, { useState } from "react"
import Modal from "../../molecules/modal"
import Button from "../../fundamentals/button"
import Medusa from "../../../services/api"
import useMedusa from "../../../hooks/use-medusa"
import InputField from "../../molecules/input"

type InviteModalProps = {
  handleClose: () => void
}

const InviteModal: React.FC<InviteModalProps> = ({ handleClose }) => {
  const [email, setEmail] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [role, setRole] = useState("member")
  const { toaster } = useMedusa("collections")

  const handleSubmit = e => {
    e.preventDefault()

    setIsLoading(true)

    const values = {
      user: email,
      role,
    }

    Medusa.invites
      .create(values)
      .then(res => {
        setIsLoading(false)
        handleClose()
        toaster("user(s) invited", "success")
      })
      .catch(error => {
        setIsLoading(false)
        toaster("Could not add user(s)", "error")
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
            onChange={e => setEmail(e.target.value)}
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
