import React, { useState, useEffect } from "react"
import { Text, Flex, Box } from "rebass"
import _ from "lodash"
import { useForm } from "react-hook-form"
import { Label, Radio } from "@rebass/forms"
import styled from "@emotion/styled"
import Medusa from "../../../services/api"

import Button from "../../../components/button"
import MultiSelect from "react-multi-select-component"
import Input from "../../../components/input"
import Select from "../../../components/select"
import Typography from "../../../components/typography"

import useMedusa from "../../../hooks/use-medusa"
import Spinner from "../../../components/spinner"
import { navigate } from "gatsby"

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

const StyledRadio = styled(Radio)`
  ${Typography.Base}
`

const StyledLabel = styled(Label)`
  ${Typography.Base}

  input[type="radio"]:checked ~ svg {
    color: #79b28a;
  }
`

const NewDiscount = ({}) => {
  const [selectedRegions, setSelectedRegions] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])
  const { register, handleSubmit } = useForm({
    defaultValues: {
      is_dynamic: false,
    },
  })

  const { products, isLoading: isLoadingProducts } = useMedusa("products")
  const { regions, isLoading: isLoadingRegions } = useMedusa("regions")

  const validProducts = () => {
    let formattedProducts = products.map(p => ({
      label: p.title,
      value: p._id,
    }))
    return _.intersectionBy(formattedProducts, selectedProducts, "value").map(
      v => v.value
    )
  }

  const validRegions = () => {
    let formattedRegions = regions.map(r => ({
      label: r.name,
      value: r._id,
    }))
    return _.intersectionBy(formattedRegions, selectedRegions, "value").map(
      v => v.value
    )
  }

  const submit = data => {
    data.discount_rule.value = parseInt(data.discount_rule.value)
    data.discount_rule.valid_for = validProducts()
    data.regions = validRegions()

    const discount = {
      code: data.code,
      is_dynamic: data.is_dynamic === "true",
      discount_rule: data.discount_rule,
      regions: data.regions || [],
    }

    Medusa.discounts.create(discount).then(() => {
      navigate("/a/discounts")
    })
  }

  if (isLoadingProducts || isLoadingRegions) {
    return (
      <Flex flexDirection="column" alignItems="center" height="100vh" mt="auto">
        <Box height="75px" width="75px" mt="50%">
          <Spinner dark />
        </Box>
      </Flex>
    )
  }

  return (
    <Flex as="form" flexDirection="column" onSubmit={handleSubmit(submit)}>
      <Text mb={4}>Discount details</Text>
      <Flex mb={5}>
        <Box width={4 / 7}>
          <Box mb={4}>
            <Input
              mb={3}
              label="Code"
              name="code"
              placeholder="SUMMER10%"
              ref={register}
            />
            <StyledLabel pb={2}>Choose valid regions</StyledLabel>
            <StyledMultiSelect
              options={regions.map(el => ({
                label: el.name,
                value: el._id,
              }))}
              value={selectedRegions}
              onChange={setSelectedRegions}
            />
          </Box>
          <Box>
            <Text fontSize={2} mb={2}>
              Is this a dynamic discount?
            </Text>
          </Box>
          <StyledLabel>
            <Flex alignItems="center">
              <StyledRadio
                name="is_dynamic"
                id="dynamic_false"
                value="false"
                ref={register}
              />
              <Text fontSize="12px" color="gray">
                No
              </Text>
            </Flex>
          </StyledLabel>
          <StyledLabel mb={3}>
            <Flex alignItems="center">
              <StyledRadio
                name="is_dynamic"
                id="dynamic_true"
                value="true"
                ref={register}
              />
              <Text fontSize="12px" color="gray">
                Yes
              </Text>
            </Flex>
          </StyledLabel>
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
              <Text fontSize="12px" color="gray">
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
              <Text fontSize="12px" color="gray">
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
              <Text fontSize="12px" color="gray">
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
              <Text fontSize="12px" color="gray">
                Item (discount is applied to specific items)
              </Text>
            </Flex>
          </StyledLabel>
          <StyledLabel pb={0}>Choose valid products</StyledLabel>
          <Text fontSize="10px" color="gray">
            Leaving it empty will make the discount available for all products
          </Text>
          <StyledMultiSelect
            options={products.map(el => ({
              label: el.title,
              value: el._id,
            }))}
            value={selectedProducts}
            onChange={setSelectedProducts}
          />
          <Flex mt={4}>
            <Box ml="auto" />
            <Button variant={"cta"} type="submit">
              Save
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Flex>
  )
}

export default NewDiscount
