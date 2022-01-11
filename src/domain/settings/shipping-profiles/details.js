import React, { useState, useEffect } from "react"
import { Flex, Box, Text } from "rebass"
import { useForm } from "react-hook-form"
import styled from "@emotion/styled"
import { MultiSelect } from "react-multi-select-component"
import { navigate } from "gatsby"

import useMedusa from "../../../hooks/use-medusa"
import Input from "../../../components/molecules/input"
import Typography from "../../../components/typography"
import Button from "../../../components/button"
import Spinner from "../../../components/spinner"

import Medusa from "../../../services/api"

const StyledMultiSelect = styled(MultiSelect)`
  ${Typography.Base}

  color: black;
  background-color: white;

  line-height: 1.22;

  border: none;
  outline: 0;

  transition: all 0.2s ease;

  border-radius: 3px;
  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(60, 66, 87, 0.16) 0px 0px 0px 1px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px;

  &:focus: {
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(206, 208, 190, 0.36) 0px 0px 0px 4px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(60, 66, 87, 0.16) 0px 0px 0px 1px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px;
  }
  &::placeholder: {
    color: #a3acb9;
  }

  .go3433208811 {
    border: none;
    border-radius: 3px;
  }
`

const StyledLabel = styled.div`
  ${Typography.Base}

  padding-bottom: 10px;
`

const ShippingProfileDetail = ({ id }) => {
  const {
    shipping_profile,
    isLoading: isLoadingProfile,
  } = useMedusa("shippingProfiles", { id })
  const { products, isLoading: isLoadingProducts } = useMedusa("products")

  const [selectedProducts, setSelectedProducts] = useState([])

  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    if (shipping_profile) {
      reset({
        name: shipping_profile.name,
        shipping_options: shipping_profile.shipping_options,
      })
      setSelectedProducts(
        shipping_profile.products.map(product => ({
          label: product.title,
          value: product._id,
        }))
      )
    }
  }, [shipping_profile, isLoadingProfile])

  const submit = data => {
    data.products = selectedProducts.map(product => product.value)
    Medusa.shippingProfiles.update(id, data).then(() => {
      navigate("/a/settings")
    })
  }

  if (isLoadingProfile || isLoadingProducts) {
    return (
      <Flex flexDirection="column" alignItems="center" height="100vh" mt="auto">
        <Box height="75px" width="75px" mt="50%">
          <Spinner dark />
        </Box>
      </Flex>
    )
  }

  return (
    <Flex as="form" onSubmit={handleSubmit(submit)} flexDirection="column">
      <Box width={3 / 7}>
        <Input
          mb={3}
          name="name"
          label="Name"
          ref={register({ required: true })}
        />
        <StyledLabel>
          Products that can be processed using the profile
        </StyledLabel>
        <StyledMultiSelect
          options={products.map(el => ({
            label: el.title,
            value: el._id,
          }))}
          selectAllLabel={"All"}
          overrideStrings={{
            allItemsAreSelected: "All products",
          }}
          value={selectedProducts}
          onChange={setSelectedProducts}
        />
      </Box>
      <Flex pt={5}>
        <Box ml="auto" />
        <Button variant={"cta"} type="submit">
          Save
        </Button>
      </Flex>
    </Flex>
  )
}

export default ShippingProfileDetail
