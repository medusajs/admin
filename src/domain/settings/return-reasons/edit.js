import React, { useState, useEffect } from "react"
import { Flex, Text, Box } from "rebass"
import { useForm } from "react-hook-form"
import Collapsible from "react-collapsible"

import Input, { StyledLabel } from "../../../components/input"
import Button from "../../../components/button"
import Card from "../../../components/card"
import Spinner from "../../../components/spinner"
import Divider from "../../../components/divider"
import { ReactSelect } from "../../../components/react-select"
import Medusa from "../../../services/api"

import useMedusa from "../../../hooks/use-medusa"

const EditChildReturnReason = ({ id, value, removeFromList }) => {
  const { register, reset, handleSubmit } = useForm()
  const {
    return_reason,
    isLoading,
    update,
    delete: returnReasonDelete,
    toaster,
  } = useMedusa("returnReasons", { id })

  useEffect(() => {
    if (isLoading) {
      return
    }
    reset({ ...return_reason })
  }, [return_reason, isLoading])

  const [isOpen, setIsOpen] = useState(false)

  if (isLoading) {
    return (
      <Flex
        mt={3}
        width={1}
        alignContent="center"
        justifyContent="space-between"
      >
        {value}
      </Flex>
    )
  }

  const onUpdateChildCategory = async data => {
    try {
      await update({ ...data })
      toaster("Successfully updated return reason", "success")
    } catch (error) {
      toaster("Failed to update return reason", "error")
    }
  }

  const onDelete = async () => {
    try {
      await returnReasonDelete()
      removeFromList()
      toaster("Successfully deleted return reason", "success")
    } catch (error) {
      toaster("Failed to delete return reason", "error")
    }
  }

  return (
    <Flex
      flexDirection="column"
      as="form"
      onSubmit={handleSubmit(onUpdateChildCategory)}
    >
      <Collapsible
        containerElementProps={{ style: { width: "100%" } }}
        transitionTime={200}
        overflowWhenOpen="visible"
        open={isOpen}
        trigger={
          <Flex
            mt={3}
            mb={2}
            width={1}
            alignContent="center"
            justifyContent="space-between"
          >
            {return_reason.value}
          </Flex>
        }
      >
        <Flex flexDirection="column">
          <Input mb={3} name="label" label="Label" ref={register} />
          <Input
            mb={3}
            name="description"
            ref={register}
            disables
            label="Description"
          />
          <Button mb={2} variant={"cta"} type="submit">
            Save
          </Button>
          <Button variant={"danger"} onClick={() => onDelete()}>
            Delete
          </Button>
        </Flex>
      </Collapsible>
    </Flex>
  )
}

const EditReturnReason = ({ id }) => {
  const { register, reset, handleSubmit } = useForm()
  const {
    return_reason,
    isLoading,
    update,
    toaster,
  } = useMedusa("returnReasons", { id })

  const [creatingNewChild, setCreatingNewChild] = useState(false)
  const [children, setChildren] = useState([])

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
    } catch (error) {
      console.log(error)
      toaster("Failed to update return reason", "error")
    }
  }

  const onCreateNewCategory = async data => {
    const newCategory = { parent_return_reason_id: id, ...data.newCategory }
    console.log(newCategory)

    Medusa.returnReasons
      .create(newCategory)
      .then(result => {
        return_reason.return_reason_children.push(result.data.return_reason)
        // navigate(`/a/settings/return-reasons`)
        toaster("Successfully created return reason", "success")
        setCreatingNewChild(false)
      })
      .catch(error => {
        console.log(error.message)
        toaster("Failed to create return reason", "error")
      })
  }

  const onDelete = id => {
    const newChildren = children.filter(c => c.id !== id)
    setChildren(newChildren)
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
    <Flex flexDirection="column">
      <Flex
        as="form"
        onSubmit={handleSubmit(onSave)}
        flexDirection="column"
        pt={5}
        alignItems="center"
        justifyContent="center"
        width="100%"
      >
        <Flex flexDirection="column" width={3 / 5} justifyContent="flex-start">
          <Text mb={1} fontWeight="bold" fontSize={20}>
            Edit Return Reason
          </Text>
          <Box>
            <Text mb={4} color="gray" fontSize={16}>
              {return_reason.value}
            </Text>
          </Box>
        </Flex>
        <Flex mb={5} width={3 / 5} flexDirection="column">
          <Input mb={3} name="label" label="Label" ref={register} width="75%" />
          <Input
            mb={3}
            name="description"
            label="Description"
            ref={register}
            width="75%"
          />
          <Flex mt={4} width="75%">
            <Box ml="auto" />
            <Button variant={"cta"} type="submit">
              Save
            </Button>
          </Flex>
        </Flex>
      </Flex>
      <Flex
        mt={4}
        width={1}
        alignItems="center"
        justifyContent="center"
        flexDirection="column"
      >
        <Flex width={3 / 5}>
          <Flex
            align-content="center"
            justifyContent="space-between"
            width={3 / 4}
          >
            <Text mb={1} color="black" fontSize={18}>
              Child return reasons
            </Text>
            <Button
              variant="primary"
              onClick={() => setCreatingNewChild(!creatingNewChild)}
            >
              {creatingNewChild ? "Cancel" : "Add"}
            </Button>
          </Flex>
        </Flex>
        <Flex width={3 / 5}>
          <Collapsible
            transitionTime={200}
            overflowWhenOpen="visible"
            open={creatingNewChild}
            containerElementProps={{ style: { width: "100%" } }}
            trigger=""
          >
            <Flex
              as="form"
              onSubmit={handleSubmit(onCreateNewCategory)}
              width={1}
              flexDirection="column"
              pt={2}
            >
              <Input
                required={true}
                mb={1}
                name="newCategory.value"
                label="Reason Code"
                ref={register}
                width="75%"
              />
              <Input
                required={true}
                mb={1}
                name="newCategory.label"
                label="Label"
                ref={register}
                width="75%"
              />
              <Input
                mb={1}
                name="newCategory.description"
                label="Description"
                ref={register}
                width="75%"
              />
              <Flex mt={4} width="75%">
                <Box ml="auto" />
                <Button variant={"cta"} type="submit">
                  Save
                </Button>
              </Flex>
            </Flex>
          </Collapsible>
        </Flex>
      </Flex>
      <Flex flexDirection="column" alignItems="center" justifyContent="center">
        <Flex width={3 / 5}>
          <Flex width={3 / 4} flexDirection="column">
            {children.map((rrc, idx) => (
              <EditChildReturnReason
                key={rrc.id}
                value={rrc.value}
                id={rrc.id}
                removeFromList={() => onDelete(rrc.id)}
              />
            ))}
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default EditReturnReason
