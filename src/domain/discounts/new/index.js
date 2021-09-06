import React, { useState, useEffect } from "react"
import { Text, Flex, Box } from "rebass"
import _ from "lodash"
import { useForm } from "react-hook-form"
import { Label } from "@rebass/forms"
import styled from "@emotion/styled"
import Medusa from "../../../services/api"

import Button from "../../../components/button"
import Pill from "../../../components/pill"
import MultiSelect from "../../../components/multi-select"
import Input from "../../../components/input"
import Typography from "../../../components/typography"

import useMedusa from "../../../hooks/use-medusa"
import Spinner from "../../../components/spinner"
import { navigate } from "gatsby"

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
  const [isFreeShipping, setIsFreeShipping] = useState(false)
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    errors,
    setValue,
  } = useForm({
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
      value: r.id,
    }))
    return _.intersectionBy(formattedRegions, selectedRegions, "value").map(
      v => v.value
    )
  }

  const constructFreeShipping = data => {
    const req = {
      code: data.code,
      is_dynamic: false,
      regions: validRegions(),
      rule: {
        description: data.description,
        value: 100,
        valid_for: validProducts(),
        allocation: "total",
        type: "free_shipping",
      },
    }

    if (data.usage_limit) {
      req.usage_limit = data.usage_limit
    }

    return req
  }

  const submit = async data => {
    if (isFreeShipping) {
      const disc = constructFreeShipping(data)

      return Medusa.discounts
        .create(disc)
        .then(() => toaster("Successfully created discount", "success"))
        .then(() => navigate("/a/discounts"))
        .catch(() => toaster("Error creating discount", "error"))
    }

    data.rule.value = parseInt(data.rule.value)

    if (data.rule.type === "fixed") {
      data.rule.value = data.rule.value * 100
    }

    data.rule.valid_for = validProducts()
    data.regions = validRegions()

    const discount = {
      code: data.code,
      is_dynamic: data.is_dynamic === "true",
      rule: data.rule,
      regions: data.regions || [],
    }

    if (data.usage_limit) {
      discount.usage_limit = data.usage_limit
    }

    Medusa.discounts
      .create(discount)
      .then(() => {
        toaster("Successfully created discount", "success")
        navigate("/a/discounts")
      })
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
      setValue("rule.type", "percentage")
    }
    setSelectedRegions(data)
  }

  return (
    <Flex
      as="form"
      flexDirection="column"
      onSubmit={handleSubmit(submit)}
      pt={5}
      alignItems="center"
      justifyContent="center"
      width="100%"
    >
      <Flex width={3 / 5} justifyContent="flex-start">
        <Text mb={4} fontWeight="bold" fontSize={20}>
          Discount details
        </Text>
      </Flex>
      <Flex mb={5} width={3 / 5} flexDirection="column">
        <Box mb={4} width="75%">
          <Input
            mb={3}
            label="Code"
            boldLabel={true}
            required={true}
            name="code"
            placeholder="SUMMER10%"
            ref={register({ required: true })}
          />
          <RequiredLabel pb={2} style={{ fontWeight: 500 }}>
            Choose valid regions
          </RequiredLabel>
          <MultiSelect
            options={regions.map(el => ({
              label: el.name,
              value: el.id,
            }))}
            overrideStrings={{
              allItemsAreSelected: "All regions",
              selectAll: "Select all",
            }}
            value={selectedRegions}
            onChange={onRegionSelect}
            mb={3}
          />
          <Input
            boldLabel={true}
            label="Usage limit"
            width="75%"
            type="number"
            name="usage_limit"
            placeholder="5"
            min="0"
            ref={register}
          />
        </Box>
        <Flex alignItems="center" mb={4}>
          <Pill
            width="30%"
            onClick={() => setIsFreeShipping(false)}
            active={!isFreeShipping}
            mr={4}
          >
            <Text fontWeight="500">Discount</Text>
          </Pill>
          <Pill
            width="30%"
            onClick={() => setIsFreeShipping(true)}
            active={isFreeShipping}
          >
            <Text fontWeight="500">Free shipping</Text>
          </Pill>
        </Flex>
        <Box>
          <RequiredLabel style={{ fontWeight: 500 }}>
            Is this a dynamic discount?
          </RequiredLabel>
        </Box>
        <StyledLabel>
          <Flex alignItems="center">
            <input
              type="radio"
              ref={register({ required: true })}
              id="is_dynamic"
              name="is_dynamic"
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
              disabled={isFreeShipping}
              ref={register({ required: true })}
              id="is_dynamic"
              name="is_dynamic"
              value="true"
              style={{ marginRight: "5px" }}
            />
            <Text fontSize="12px" color="gray">
              Yes
            </Text>
          </Flex>
        </StyledLabel>
        <HorizontalDivider my={2} />
        <Box>
          <Text fontSize={2} mb={3} mt={2}>
            Discount rule
          </Text>
        </Box>
        <Input
          boldLabel={true}
          mb={3}
          width="75%"
          label="Description"
          required={true}
          name="rule.description"
          placeholder="Summer sale 2020"
          ref={register({ required: true })}
        />
        <Input
          boldLabel={true}
          mb={3}
          label="Value"
          disabled={isFreeShipping}
          width="75%"
          type="number"
          required={true}
          name="rule.value"
          placeholder={isFreeShipping ? "Free shipping" : "10"}
          min="0"
          ref={register({ required: !isFreeShipping ? true : false })}
        />
        <RequiredLabel pb={2} style={{ fontWeight: 500 }}>
          Type
        </RequiredLabel>
        <StyledLabel>
          <Flex alignItems="center">
            <input
              type="radio"
              ref={register({ required: !isFreeShipping ? true : false })}
              id="percentage"
              name="rule.type"
              disabled={isFreeShipping}
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
              ref={register({ required: !isFreeShipping ? true : false })}
              id="fixed"
              name="rule.type"
              value="fixed"
              disabled={selectedRegions.length > 1 || isFreeShipping}
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
        <RequiredLabel pb={2} style={{ fontWeight: 500 }}>
          Allocation
        </RequiredLabel>
        <StyledLabel fontSize="10px" color="gray">
          <Flex alignItems="center">
            <input
              type="radio"
              ref={register({ required: !isFreeShipping ? true : false })}
              id="total"
              name="rule.allocation"
              disabled={isFreeShipping}
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
              ref={register({ required: !isFreeShipping ? true : false })}
              id="item"
              name="rule.allocation"
              disabled={isFreeShipping}
              value="item"
              style={{ marginRight: "5px" }}
            />
            <Text fontSize="12px" color="gray">
              Item (discount is applied to specific items)
            </Text>
          </Flex>
        </StyledLabel>
        {/* <StyledLabel pb={0}>Choose valid products</StyledLabel>
        <Text fontSize="10px" color="gray">
          Leaving it empty will make the discount available for all products
        </Text>

        <MultiSelect
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
        /> */}
        <Flex mt={4}>
          <Box ml="auto" />
          <Button variant={"cta"} type="submit">
            Save
          </Button>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default NewDiscount
