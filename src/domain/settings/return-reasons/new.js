import { navigate } from "gatsby"
import { useAdminCreateReturnReason } from "medusa-react"
import React from "react"
import { useForm } from "react-hook-form"
import { Box, Flex, Text } from "rebass"
import BreadCrumb from "../../../components/breadcrumb"
import Button from "../../../components/button"
import Card from "../../../components/card"
import Input from "../../../components/molecules/input"
import useMedusa from "../../../hooks/use-medusa"

const NewReturnReason = ({ id }) => {
  const { register, handleSubmit } = useForm()
  const createReturnReason = useAdminCreateReturnReason()
  const { toaster } = useMedusa("store")

  const onSave = data => {
    console.log("on save handler")
    createReturnReason.mutate(data, {
      onSuccess: newData => {
        toaster("Created a new return reason", "success")
        navigate(`/a/settings/return-reasons/${newData.return_reason.id}`)
      },
      onError: () => {
        toaster("Cant create a Return reason with an existing code", "error")
      },
    })
  }

  return (
    <Flex alignItems="center" pt={5} flexDirection="column">
      <Card width="90%" px={0}>
        <BreadCrumb
          previousRoute="/a/settings/return-reasons"
          previousBreadCrumb="Settings > Return Reasons"
          currentPage="New reason"
        />
        <Flex
          as="form"
          onSubmit={handleSubmit(onSave)}
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          width={1}
        >
          <Flex width={1} flexDirection="column">
            <Flex>
              <Text mb={3} fontWeight="bold" fontSize={20}>
                Create reason
              </Text>
            </Flex>
            <Card.Body py={0} flexDirection="column">
              <Flex mb={5} flexDirection="column">
                <Input
                  required={true}
                  mb={3}
                  name="value"
                  label="Reason Code"
                  ref={register}
                />
                <Input
                  required={true}
                  mb={3}
                  name="label"
                  label="Label"
                  ref={register}
                />
                <Input
                  mb={3}
                  name="description"
                  label="Description"
                  ref={register}
                />
                <Flex mt={4}>
                  <Box ml="auto" />
                  <Button variant={"cta"} type="submit">
                    Create
                  </Button>
                </Flex>
              </Flex>
            </Card.Body>
          </Flex>
        </Flex>
      </Card>
    </Flex>
  )
}

export default NewReturnReason
