import styled from "@emotion/styled"
import React, { useState } from "react"
import { Box, Flex, Text } from "rebass"
import { ReactComponent as CloseIcon } from "../../../assets/svg/2.0/20px/x.svg"
import Modal from "../../../components/modal"
import Button from "../../../components/button"
import Medusa from "../../../services/api"
import useMedusa from "../../../hooks/use-medusa"
import InputField from "../../../components/input"

const InviteModal = ({ handleClose }) => {
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
    <Modal onClick={handleClose}>
      <Modal.Body >
        <Modal.Header handleClose={handleClose} justifyContent="space-between" alignItems="center">
          <div className="flex flex-col w-full py-2">
            <span onClick={handleClose} className="stroke-grey-50 cursor-pointer self-end">
              <CloseIcon />
            </span>
            <span className="text-xlarge">Invite Users</span>
          </div>
        </Modal.Header>
        <Modal.Content flexDirection="column">
          <div className="w-[750px]">
            <InputField
              placeholder="lebron@james.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
        </Modal.Content>
        <Modal.Footer>
          <div className="flex w-full justify-end">
            <Button mr={2} variant="primary" onClick={handleClose}>
              Cancel
            </Button>
            <Button loading={isLoading} onClick={handleSubmit} variant="cta">
              Invite
            </Button>
          </div>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default InviteModal
