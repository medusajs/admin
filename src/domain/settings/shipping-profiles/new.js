import React, { useState } from "react"
import { Flex, Box } from "rebass"
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

const NewShippingProfiles = ({ id }) => {
  const { products, isLoading: isLoadingProducts } = useMedusa("products")

  const [selectedProducts, setSelectedProducts] = useState([])

  const { register, handleSubmit } = useForm()

  const submit = data => {
    Medusa.shippingProfiles.create(data).then(({ data }) => {
      navigate(`/a/settings`)
    })
  }

  if (isLoadingProducts) {
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
          placeholder="E.g.: Express shipping"
          ref={register}
        />
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

export default NewShippingProfiles
