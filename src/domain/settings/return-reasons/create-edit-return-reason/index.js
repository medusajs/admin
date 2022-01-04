import React, { useState, useEffect } from "react"
import { Text, Flex, Box } from "rebass"
import { useForm } from "react-hook-form"
import Typography from "../../../../components/typography"
import { Label } from "@rebass/forms"
import styled from "@emotion/styled"

import { ReactComponent as CrossIcon } from "../../../../assets/svg/cross.svg"
import Modal from "../../../../components/modal"
import Input from "../../../../components/input"
import Button from "../../../../components/button"

import Medusa from "../../../../services/api"
import useMedusa from "../../../../hooks/use-medusa"

import { getErrorMessage } from "../../../../utils/error-messages"

const StyledLabel = styled.div`
  ${Typography.Base}
  ${props =>
    props.boldLabel &&
    `
    font-weight: 500;
  `}
  ${props =>
    props.inline
      ? `
  text-align: right;
  padding-right: 15px;
  `
      : `
  padding-bottom: 10px;
  `}

  ${props =>
    props.required &&
    `
  &:after {
    color: rgba(255, 0, 0, 0.5);
    content: " *";
  }
  `}
`

const ReturnReasonModal = ({
  reason,
  parentReturnReason,
  onDismiss,
  onDelete,
  onCreate,
  onUpdate,
}) => {
  const { register, reset, handleSubmit } = useForm()
  const [value, setValue] = useState(reason ? reason.value : "")
  const [label, setLabel] = useState(reason ? reason.label : "")
  const [description, setDescription] = useState(
    reason ? reason.description : ""
  )
  const id = reason?.id
  const {
    delete: childReturnReasonDelete,
    toaster,
  } = useMedusa("returnReasons", { id })

  const onClickDelete = async () => {
    try {
      await childReturnReasonDelete()
      onDelete(id)
      toaster("Sucessfully deleted return reason")
    } catch (error) {
      toaster(getErrorMessage(error), "error")
    }
    onDismiss()
  }

  const onSubmit = async () => {
    let error = ""
    try {
      if (reason) {
        const data = { label: label, description: description }

        const result = await Medusa.returnReasons.update(id, data)
        onUpdate(result.data.return_reason)
        toaster("Successfully updated return reason", "success")
        error = "Failed to update return reason"
      } else {
        const data = {
          parent_return_reason_id: parentReturnReason.id,
          value: value,
          label: label,
          description: description,
        }

        error = "Failed to create return reason"
        const result = await Medusa.returnReasons.create(data)
        onCreate(result.data.return_reason)
        toaster("Successfully updated return reason", "success")
      }
    } catch (error) {
      toaster(getErrorMessage(error), "error")
    }
    onDismiss()
  }

  const title = reason ? "Edit nested reason" : "Create nested reason"

  return (
    <Modal onClick={onDismiss}>
      <Modal.Body as="form" onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header sx={{ fontWeight: 600, justifyContent: "space-between" }}>
          {title}
          <Button
            sx={{
              height: "25px",
              background: "none",
              color: "black",
              padding: "0px",
            }}
            onClick={onDismiss}
          >
            <CrossIcon
              style={{ width: "12px", height: "12px", fill: "#000000" }}
            />
          </Button>
        </Modal.Header>
        <Modal.Content flexDirection="column">
          <Flex flexDirection="column">
            {reason ? (
              <Flex mt={2} mb={4}>
                <Text color="gray" mr={4} fontSize={16}>
                  Reason code
                </Text>
                <Text color="black" fontSize={16}>
                  {reason.value}
                </Text>
              </Flex>
            ) : (
              <Box mb={3}>
                <Input
                  label="Reason code"
                  name="value"
                  onChange={e => setValue(e.target.value)}
                  value={value}
                  mt={2}
                />
              </Box>
            )}
            <Box mb={3}>
              <Input
                label="label"
                mt={2}
                name="label"
                onChange={e => setLabel(e.target.value)}
                value={label}
              />
            </Box>
            <Box mb={3}>
              <Input
                mt={2}
                label="description"
                name="description"
                onChange={e => setDescription(e.target.value)}
                value={description}
              />
            </Box>

            {reason && (
              <Box mb={3}>
                <StyledLabel boldLabel={true} sx={{ color: "black" }}>
                  Danger zone
                </StyledLabel>
                <Button
                  width={1 / 3}
                  variant={"danger"}
                  onClick={onClickDelete}
                >
                  Delete
                </Button>
              </Box>
            )}
          </Flex>
        </Modal.Content>
        <Modal.Footer justifyContent="flex-end">
          <Button mr={2} onClick={onDismiss} type="submit" variant="primary">
            Cancel
          </Button>
          <Button type="submit" variant="cta">
            Save
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default ReturnReasonModal
