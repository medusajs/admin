import React, { useState, useEffect } from "react"
import { Text, Flex, Box } from "rebass"
import _ from "lodash"
import { useForm } from "react-hook-form"
import { Label, Radio } from "@rebass/forms"
import styled from "@emotion/styled"
import Medusa from "../../../services/api"

import ProductSelector from "./product-selector"
import Button from "../../../components/button"
import MultiSelect from "react-multi-select-component"
import Input from "../../../components/input"
import Select from "../../../components/select"
import Typography from "../../../components/typography"

import useMedusa from "../../../hooks/use-medusa"
import Spinner from "../../../components/spinner"

export const StyledMultiSelect = styled(MultiSelect)`
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

const StyledRadio = styled(Radio)`
  ${Typography.Base}
`

const StyledLabel = styled(Label)`
  ${Typography.Base}

  input[type="radio"]:checked ~ svg {
    color: #79b28a;
  }
`

const RequiredLabel = styled.div`
  ${Typography.Base}
  ${props =>
    props.inline
      ? `
  text-align: right;
  padding-right: 15px;
  `
      : `
  padding-bottom: 10px;
  `}

  &:after {
    color: rgba(255, 0, 0, 0.5);
    content: " *";
  }
`

const NewOrder = ({}) => {
  const [selectedRegions, setSelectedRegions] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])
  const [selectedVariants, setSelectedVariants] = useState([])
  const [variants, setVariants] = useState([])
  const [showProductSelector, setShowProductSelector] = useState(false)

  const { register, handleSubmit } = useForm()

  const { products, isLoading: isLoadingProducts } = useMedusa("products")

  useEffect(() => {
    const fetchAllVariants = async () => {
      const newVariants = []
      Promise.all(
        selectedProducts.map(async product => {
          const p = await Medusa.products.retrieve(product._id)
          newVariants.push(p.variant)
        })
      )
      setVariants(newVariants)
    }

    fetchAllVariants()
  }, [selectedProducts])

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
    <Flex as="form" flexDirection="column" onSubmit={handleSubmit}>
      <Text mb={4}>Order details</Text>
      <Flex mb={5}>
        <Box width={4 / 7}>
          <Button
            variant={"primary"}
            onClick={() => setShowProductSelector(!showProductSelector)}
          >
            Select items
          </Button>
          <Box mb={4}>
            <Input
              mb={3}
              label="Code"
              name="code"
              placeholder="SUMMER10%"
              ref={register}
            />
          </Box>
          <Box>
            <Text fontSize={2} mb={2}>
              Discount rule
            </Text>
          </Box>
          <Input
            mb={3}
            label="Description"
            name="discount_rule.description"
            placeholder="Summer sale 2020"
            ref={register}
          />
          <Input
            mb={3}
            label="Value"
            type="number"
            name="discount_rule.value"
            placeholder="10"
            ref={register}
          />
          <StyledLabel pb={2}>Type</StyledLabel>
          <StyledLabel>
            <Flex alignItems="center">
              <StyledRadio
                name="discount_rule.type"
                id="percentage"
                value="percentage"
                ref={register}
              />
              <Text fontSize="12px" color="gray" height="100%">
                Percentage
              </Text>
            </Flex>
          </StyledLabel>
          <StyledLabel mb={3} fontSize="10px" color="gray">
            <Flex alignItems="center">
              <StyledRadio
                name="discount_rule.type"
                id="fixed"
                value="fixed"
                ref={register}
              />
              <Text fontSize="12px" color="gray" height="100%">
                Fixed amount
              </Text>
            </Flex>
          </StyledLabel>
          <StyledLabel pb={2}>Allocation</StyledLabel>
          <StyledLabel fontSize="10px" color="gray">
            <Flex alignItems="center">
              <StyledRadio
                name="discount_rule.allocation"
                id="Total"
                value="total"
                ref={register}
              />
              <Text fontSize="12px" color="gray" height="100%">
                Total (discount is applied to the total amount)
              </Text>
            </Flex>
          </StyledLabel>
          <StyledLabel mb={3} fontSize="10px" color="gray">
            <Flex alignItems="center">
              <StyledRadio
                name="discount_rule.type"
                id="item"
                value="item"
                ref={register}
              />
              <Text fontSize="12px" color="gray" height="100%">
                Item (discount is applied to specific items)
              </Text>
            </Flex>
          </StyledLabel>
          <Flex mt={4}>
            <Box ml="auto" />
            <Button variant={"cta"} type="submit">
              Save
            </Button>
          </Flex>
        </Box>
      </Flex>
      {showProductSelector && (
        <ProductSelector
          onClick={() => setShowProductSelector(null)}
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
          products={products}
        />
      )}
    </Flex>
  )
}

export default NewOrder
