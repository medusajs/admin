import React, { useState, useEffect } from "react"
import { Flex, Box, Text } from "rebass"
import { navigate } from "gatsby"
import { useForm } from "react-hook-form"

import useMedusa from "../../hooks/use-medusa"
import Input from "../../components/input"
import Card from "../../components/card"
import Button from "../../components/button"
import { getErrorMessage } from "../../utils/error-messages"
import BreadCrumb from "../../components/breadcrumb"

const HorizontalDivider = props => (
  <Box
    {...props}
    as="hr"
    m={props.m}
    sx={{
      bg: "#e3e8ee",
      border: 0,
      height: 1,
    }}
  />
)

const AccountDetails = () => {
  const { register, reset, handleSubmit } = useForm()
  const { store, isLoading, update, toaster } = useMedusa("store")
  const [showAdvanced, setShowAdvanced] = useState(false)

  useEffect(() => {
    if (isLoading) return
    reset({
      name: store.name,
      swap_link_template: store.swap_link_template,
      payment_link_template: store.payment_link_template,
    })
  }, [store, isLoading])

  const validateUrl = (address) => {
    if(!address || address === '')
    {
      return true
    }

    try {
      const url = new URL(address);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch (_) {
      return false;  
    }
  }

  const onSubmit = data => {
    if(!validateUrl(data.swap_link_template) || !validateUrl(data.payment_link_template)){
      toaster("Malformed url", 'error')
      return
    }
    
    try {
      localStorage.removeItem("medusa::cache::store")

      update(data)
      toaster("Successfully updated store", "success")
      window.location.reload()
    } catch (error) {
      toaster(getErrorMessage(error), "error")
    }
  }

  return (
    <Flex
      flexDirection="column"
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      py={5}
    >
      <Card>
        <BreadCrumb
          previousRoute="/a/settings/"
          previousBreadCrumb="Settings"
          currentPage="Account details"
        />
        <Flex>
          <Text mb={3} fontSize={20} fontWeight="bold">
            Account details
          </Text>
          <Box ml="auto" />
        </Flex>
        <Card.Body flexDirection="column">
          <Flex width={1} mb={4}>
            <Box width={1 / 2}>
              <Input
                boldLabel={true}
                label="Store name"
                name="name"
                placeholder="Medusa Store"
                ref={register}
              />
            </Box>
          </Flex>
          <HorizontalDivider />
          <Flex>
            <Text my={3} fontSize={14} fontWeight="bold">
              Advanced settings
            </Text>
          </Flex>
          <Flex width={1}>
            <Box width={1 / 2}>
              <Input
                boldLabel={true}
                label="Swap link template"
                name="swap_link_template"
                placeholder="https://acme.inc/swap"
                ref={register}
              />
            </Box>
          </Flex>
          <Flex width={1} mt={3}>
            <Box width={1 / 2}>
              <Input
                boldLabel={true}
                label="Draft order link template"
                name="payment_link_template"
                placeholder="https://acme.inc/swap"
                ref={register}
              />
            </Box>
          </Flex>
        </Card.Body>
        <Card.Footer justifyContent="flex-start" mt={2}>
          <Button type="submit" fontWeight="bold" variant="cta">
            Save
          </Button>
        </Card.Footer>
      </Card>
    </Flex>
  )
}

export default AccountDetails
