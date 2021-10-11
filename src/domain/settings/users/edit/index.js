import styled from "@emotion/styled"
import { Label, Radio } from "@rebass/forms"
import React, { useState } from "react"
import { Box, Flex, Text } from "rebass"
import Button from "../../../../components/button"
import { ReactComponent as CloseIcon } from "../../../../assets/svg/cross.svg"
import Badge from "../../../../components/badge"
import Modal from "../../../../components/modal"
import { DefaultCellContent } from "../../../../components/table"
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

const EditUser = ({ handleClose, user, triggerRefetch }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [role, setRole] = useState(user.role)
  const { toaster } = useMedusa("collections")

  const onChange = e => {
    setRole(e.target.value)
  }

  const onSubmit = () => {
    setIsLoading(true)
    Medusa.users
      .update(user.id, {
        role,
      })
      .then(res => res.data)
      .then(data => {
        triggerRefetch()
        setIsLoading(false)
      })
      .catch(err => toaster("Failed to edit user", "error"))

    handleClose()
  }

  const handleDelete = () => {
    Medusa.users.delete(user.id).then(res => {
      triggerRefetch()
    })

    handleClose()
  }

  return (
    <Modal onClick={handleClose}>
      <Modal.Body px={2}>
        <Modal.Header alignItems="center" justifyContent="space-between">
          <Text fontWeight={700} fontSize={3}>
            Edit User
          </Text>
          <CloseIcon
            onClick={handleClose}
            width={14}
            height={14}
            style={{ cursor: "pointer" }}
          />
        </Modal.Header>
        <Modal.Content flexDirection="column">
          <Box mb={3}>
            <Text fontSize={1} fontWeight={600} mb={2}>
              Name
            </Text>
            <Text fontSize={1}>
              {!user.first_name && !user.last_name
                ? " - "
                : `${user.first_name || ""} ${user.last_name || ""}`}
            </Text>
          </Box>
          <Box mb={3}>
            <Text fontSize={1} fontWeight={600} mb={2}>
              Email
            </Text>
            <Flex alignItems="center">
              <Text fontSize={1}>{user.email}</Text>
              <Badge
                ml={3}
                sx={{ fontSize: "8px" }}
                {...decideBadgeColor(user?.email_status)}
              >
                {user?.email_status}
              </Badge>
            </Flex>
          </Box>
          <Flex flexDirection="column">
            <Text fontSize={1} fontWeight={600} mb={2}>
              Role
            </Text>
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
                    <Label>
                      <Radio
                        checked={"member" === role}
                        onChange={onChange}
                        name="role"
                        value="member"
                      />
                    </Label>
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
                    For developers who build store functionality and interact
                    with the API
                  </Cell>
                </Row>
              </tbody>
            </table>
            <Box mb={1}>
              <Text fontSize={1} mb={2} fontWeight={600} mb={2}>
                Remove
              </Text>
              <Button variant="delete" onClick={handleDelete}>
                Remove User
              </Button>
            </Box>
          </Flex>
        </Modal.Content>
        <Modal.Footer justifyContent="flex-end">
          <Button mr={2} variant="primary" onClick={handleClose}>
            Cancel
          </Button>
          <Button loading={isLoading} variant="cta" onClick={onSubmit}>
            Save
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default EditUser
