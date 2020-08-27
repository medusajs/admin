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

const NewDiscount = ({}) => {
  const [selectedRegions, setSelectedRegions] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])
  const { register, handleSubmit, getValues, errors, setValue } = useForm({
    defaultValues: {
      is_dynamic: false,
    },
  })

  const { products, isLoading: isLoadingProducts, toaster } = useMedusa(
    "products"
  )
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

    Medusa.discounts
      .create(discount)
      .then(() => toaster("Successfully created discount", "success"))
      .then(() => navigate("/a/discounts"))
      .catch(() => toaster("Error creating discount", "error"))
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

  const onRegionSelect = data => {
    if (data.length > 1) {
      setValue("discount_rule.type", "percentage")
    }
    setSelectedRegions(data)
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
              required={true}
              name="code"
              placeholder="SUMMER10%"
              ref={register({ required: true })}
            />
            <RequiredLabel pb={2}>Choose valid regions</RequiredLabel>
            <StyledMultiSelect
              options={regions.map(el => ({
                label: el.name,
                value: el._id,
              }))}
              selectAllLabel={"All"}
              overrideStrings={{
                allItemsAreSelected: "All regions",
              }}
              value={selectedRegions}
              onChange={onRegionSelect}
            />
          </Box>
          <Box>
            <RequiredLabel>Is this a dynamic discount?</RequiredLabel>
          </Box>
          <StyledLabel>
            <Flex alignItems="center">
              <input
                type="radio"
                ref={register({ required: true })}
                id="dynamic_true"
                name="dynamic_true"
                value="false"
                style={{ marginRight: "5px" }}
              />
              <Text fontSize="12px" color="gray">
                No
              </Text>
            </Flex>
          </StyledLabel>
          <StyledLabel mt={2} mb={3}>
            <Flex alignItems="center">
              <input
                type="radio"
                ref={register({ required: true })}
                id="dynamic_true"
                name="dynamic_true"
                value="true"
                style={{ marginRight: "5px" }}
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
            required={true}
            name="discount_rule.description"
            placeholder="Summer sale 2020"
            ref={register({ required: true })}
          />
          <Input
            mb={3}
            label="Value"
            type="number"
            required={true}
            name="discount_rule.value"
            placeholder="10"
            ref={register({ required: true })}
          />
          <RequiredLabel pb={2}>Type</RequiredLabel>
          <StyledLabel>
            <Flex alignItems="center">
              <input
                type="radio"
                ref={register({ required: true })}
                id="percentage"
                name="discount_rule.type"
                value="percentage"
                style={{ marginRight: "5px" }}
              />
              <Text fontSize="12px" color="gray">
                Percentage
              </Text>
            </Flex>
          </StyledLabel>
          <StyledLabel mt={2} mb={3} fontSize="10px" color="gray">
            <Flex alignItems="center">
              <input
                type="radio"
                ref={register({ required: true })}
                id="fixed"
                name="discount_rule.type"
                value="fixed"
                disabled={selectedRegions.length > 1}
                style={{ marginRight: "5px" }}
              />
              <Text fontSize="12px" color="gray">
                Fixed amount{" "}
                {selectedRegions.length > 1 ? (
                  <span style={{ fontSize: "8px" }}>
                    (not allowed for multi-regional discounts)
                  </span>
                ) : (
                  ""
                )}
              </Text>
            </Flex>
          </StyledLabel>
          <RequiredLabel pb={2}>Allocation</RequiredLabel>
          <StyledLabel fontSize="10px" color="gray">
            <Flex alignItems="center">
              <input
                type="radio"
                ref={register({ required: true })}
                id="total"
                name="discount_rule.allocation"
                value="total"
                style={{ marginRight: "5px" }}
              />
              <Text fontSize="12px" color="gray">
                Total (discount is applied to the total amount)
              </Text>
            </Flex>
          </StyledLabel>
          <StyledLabel mt={2} mb={3} fontSize="10px" color="gray">
            <Flex alignItems="center">
              <input
                type="radio"
                ref={register({ required: true })}
                id="item"
                name="discount_rule.allocation"
                value="item"
                style={{ marginRight: "5px" }}
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
            selectAllLabel={"All"}
            overrideStrings={{
              allItemsAreSelected: "All products",
            }}
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
