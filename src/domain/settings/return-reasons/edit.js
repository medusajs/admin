import React, { useState, useEffect } from "react"
import { Flex, Text, Box } from "rebass"
import { navigate } from "gatsby"
import { useForm } from "react-hook-form"

import Input, { StyledLabel } from "../../../components/input"
import Button from "../../../components/button"
import Spinner from "../../../components/spinner"
import InfoTooltip from "../../../components/info-tooltip"
import BreadCrumb from "../../../components/breadcrumb"

import ReturnReasonsList from "./return-reasons-list"

import useMedusa from "../../../hooks/use-medusa"
import ReturnReasonModal from "./create-edit-return-reason"

const EditReturnReason = ({ id }) => {
  const { register, reset, handleSubmit } = useForm()
  const {
    return_reason,
    isLoading,
    update,
    delete: returnReasonDelete,
    toaster,
  } = useMedusa("returnReasons", { id })

  const [children, setChildren] = useState([])
  const [showReasonEdit, setShowReasonEdit] = useState(false)
  const [editReturnReason, setEditReturnReason] = useState(undefined)

  useEffect(() => {
    if (isLoading) {
      return
    }
    setChildren(return_reason.return_reason_children)
    reset({ ...return_reason })
  }, [return_reason, isLoading])

  const onSave = async data => {
    try {
      await update({ ...data })
      toaster("Successfully updated return reason", "success")
      navigate("/a/settings/return-reasons/")
    } catch (error) {
      toaster("Failed to update return reason", "error")
    }
  }

  const deleteReturnReason = async () => {
    try {
      await returnReasonDelete()
    } catch (err) {}
    navigate("/a/settings/return-reasons/")
  }

  if (isLoading) {
    return (
      <Flex flexDirection="column" alignItems="center" height="100vh" mt="auto">
        <Box height="75px" width="75px" mt="50%">
          <Spinner dark />
        </Box>
      </Flex>
    )
  }

  return (
    <Flex alignItems="center" pt={5} flexDirection="column">
      <Flex
        as="form"
        width={1}
        width="90%"
        onSubmit={handleSubmit(onSave)}
        alignItems="center"
        flexDirection="column"
      >
        <BreadCrumb
          previousRoute="/a/settings/return-reasons"
          previousBreadCrumb="Settings > Return Reasons"
          currentPage="Edit reason"
        />
        <Flex
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          width={1}
        >
          <Flex flexDirection="column" width={1} justifyContent="flex-start">
            <Text mb={4} fontWeight="bold" fontSize={20}>
              Edit Return Reason
            </Text>
            <Flex mb={4}>
              <Text color="gray" mr={4} fontSize={16}>
                Reason code
              </Text>
              <Text color="black" fontSize={16}>
                {return_reason.value}
              </Text>
            </Flex>
          </Flex>
          <Flex width={1} flexDirection="column">
            <StyledLabel boldLabel={true} sx={{ color: "black" }}>
              Label
            </StyledLabel>
            <Input mb={3} name="label" ref={register} />
            <StyledLabel boldLabel={true} sx={{ color: "black" }}>
              Description
            </StyledLabel>
            <Input mb={3} name="description" ref={register} />
          </Flex>
        </Flex>
        <Flex
          mt={4}
          width={1}
          alignItems="center"
          justifyContent="center"
          flexDirection="column"
        >
          <Flex width={1}>
            <Flex
              width={1}
              align-content="center"
              alignItems="baseline"
              justifyContent="space-between"
              flexDirection={children?.length > 0 ? "row" : "column"}
            >
              <Flex alignItems="baseline">
                <Text
                  mb={2}
                  mr={2}
                  color="black"
                  fontWeight={500}
                  fontSize={18}
                >
                  Child return reasons
                </Text>
                <InfoTooltip tooltipText="nested return reasons allow you to categorize return reasons" />
              </Flex>
              <Flex>
                <Button
                  variant={children?.length > 0 ? "cta" : "primary"}
                  onClick={() => {
                    setEditReturnReason(undefined)
                    setShowReasonEdit(true)
                  }}
                >
                  + Create nested Reason
                </Button>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
        <Flex
          flexDirection="column"
          alignItems="center"
          width={1}
          justifyContent="center"
        >
          <Flex width={1}>
            {children?.length > 0 && (
              <ReturnReasonsList
                return_reasons={children}
                onEditClick={reason => {
                  setEditReturnReason(reason)
                  setShowReasonEdit(true)
                }}
              />
            )}
          </Flex>
        </Flex>
        <Flex width={1} mt={4} flexDirection="column" alignItems="flex-start">
          <StyledLabel>
            <Text fontSize={18} sx={{ color: "black" }} fontWeight={500}>
              Danger zone
            </Text>
          </StyledLabel>
          <Button
            onClick={() => deleteReturnReason()}
            variant="danger"
            width="150px"
          >
            Delete
          </Button>
        </Flex>
        <Flex width={1} alignItems="flex-end" mt={6}>
          <Box ml="auto" />
          <Button variant={"cta"} type="submit">
            Save
          </Button>
        </Flex>
      </Flex>

      {showReasonEdit && (
        <ReturnReasonModal
          reason={editReturnReason}
          parentReturnReason={return_reason}
          onDismiss={() => setShowReasonEdit(false)}
          onCreate={reason => children.push(reason)}
          onUpdate={reason => {
            setChildren(
              children.map(c => (c.id === reason.id ? { ...reason } : c))
            )
          }}
          onDelete={id => setChildren(children.filter(c => c.id !== id))}
        />
      )}
    </Flex>
  )
}

export default EditReturnReason
