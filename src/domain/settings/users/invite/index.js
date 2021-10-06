import styled from "@emotion/styled"
import { Label, Radio } from "@rebass/forms"
import React, { useState } from "react"
import { Box, Flex, Text } from "rebass"
import { ReactComponent as CloseIcon } from "../../../../assets/svg/cross.svg"
import Modal from "../../../../components/modal"
import { DefaultCellContent } from "../../../../components/table"
import TagInput from "../../../../components/tag-input"
import useModal from "../../../../hooks/use-modal"
import Button from "../../../../components/button"
import Medusa from "../../../../services/api"
import useMedusa from "../../../../hooks/use-medusa"

const Row = styled.tr`
  font-size: ${props => props.theme.fontSizes[1]}px;
  border-top: ${props => props.theme.borders.hairline};

  td:last-child {
    padding-left: 20px;
    padding-right: 30px;
  }
`

const Cell = styled.td`
  padding: 15px 5px;
`

const Invite = ({ triggerRefetch }) => {
  const { isOpen, handleClose, handleOpen } = useModal()
  const [invites, setInvites] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [role, setRole] = useState("member")
  const { toaster } = useMedusa("collections")

  const handleChange = newTags => {
    setInvites(newTags)
  }

  const onChange = e => {
    setRole(e.target.value)
  }

  const handleSubmit = e => {
    e.preventDefault()
    setIsLoading(true)
    const values = {
      users: invites,
      role,
    }

    Medusa.users
      .invite(values)
      .then(res => {
        setIsLoading(false)
        handleClose()
        setRole("member")
        setInvites([])
        triggerRefetch()
        toaster("user(s) invited", "success")
      })
      .catch(error => {
        setIsLoading(false)
        triggerRefetch()
        toaster("Could not add user(s)", "error")
      })
  }

  return (
    <>
      <Button onClick={handleOpen} variant="cta">
        + Invite Users
      </Button>
      {isOpen && (
        <Modal onClick={handleClose}>
          <Modal.Body as="form" onSubmit={handleSubmit}>
            <Modal.Header justifyContent="space-between" alignItems="center">
              <Text variant="h2">Invite Users</Text>
              <CloseIcon
                onClick={handleClose}
                width={14}
                height={14}
                style={{ cursor: "pointer" }}
              />
            </Modal.Header>
            <Modal.Content flexDirection="column">
              <Box mb={4}>
                <TagInput
                  placeholder="john@doe.com, jane@doe.com, etc"
                  values={invites}
                  onChange={handleChange}
                />
              </Box>
              <Flex flexDirection="column">
                <table>
                  <tbody>
                    <Row>
                      <Cell>
                        <Label>
                          <Radio
                            checked={"admin" === role}
                            onChange={onChange}
                            name="role"
                            value="admin"
                          />
                        </Label>
                      </Cell>
                      <Cell>
                        <DefaultCellContent>Admin</DefaultCellContent>
                      </Cell>
                      <Cell>
                        For business owners and managers with full control
                      </Cell>
                    </Row>
                    <Row variant="tiny.default">
                      <Cell mr={1}>
                        {/* <Label> */}
                        <Radio
                          checked={"member" === role}
                          onChange={onChange}
                          name="role"
                          value="member"
                        />
                        {/* </Label> */}
                      </Cell>
                      <Cell mr={1}>
                        <DefaultCellContent>Member</DefaultCellContent>
                      </Cell>
                      <Cell>
                        For employees and customer service who manage your store
                      </Cell>
                    </Row>
                    <Row>
                      <Cell>
                        <Label>
                          <Radio
                            checked={"developer" === role}
                            onChange={onChange}
                            name="role"
                            value="developer"
                          />
                        </Label>
                      </Cell>
                      <Cell>
                        <DefaultCellContent>Delevoper</DefaultCellContent>
                      </Cell>
                      <Cell>
                        For developers who build store functionality and
                        interact with the API
                      </Cell>
                    </Row>
                  </tbody>
                </table>
              </Flex>
            </Modal.Content>
            <Modal.Footer justifyContent="flex-end">
              <Button mr={2} variant="primary" onClick={handleClose}>
                Cancel
              </Button>
              <Button loading={isLoading} variant="cta" type="submit">
                Invite
              </Button>
            </Modal.Footer>
          </Modal.Body>
        </Modal>
      )}
    </>
  )
}

export default Invite
