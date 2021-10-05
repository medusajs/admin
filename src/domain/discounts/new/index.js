import React, { useState } from "react"
import { Text, Flex, Box } from "rebass"
import _ from "lodash"
import { useForm } from "react-hook-form"
import { Label } from "@rebass/forms"
import styled from "@emotion/styled"
import Medusa from "../../../services/api"
import moment from "moment"

import AvailabilityDuration from "../../../components/availability-duration"
import Button from "../../../components/button"
import Pill from "../../../components/pill"
import MultiSelect from "../../../components/multi-select"
import Input from "../../../components/input"
import Typography from "../../../components/typography"
import ProductSelection from "../product-selection"

import DatePicker from "../../../components/date-picker/date-picker"
import useMedusa from "../../../hooks/use-medusa"
import Spinner from "../../../components/spinner"
import InfoTooltip from "../../../components/info-tooltip"
import Tooltip from "../../../components/tooltip"
import { ReactComponent as InfoIcon } from "../../../assets/svg/info.svg"

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
  const [items, setItems] = useState([])
  const [selectedRegions, setSelectedRegions] = useState([])
  const [isFreeShipping, setIsFreeShipping] = useState(false)
  const [isPercentageDiscount, setIsPercentageDiscount] = useState(false)
  const [isAllocatedToItem, setIsAllocatedToItem] = useState(false)
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(undefined)
  const [isDynamic, setIsDynamic] = useState(false)
  const [iso8601Date, setIso8601Date] = useState("")
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

  const { toaster } = useMedusa("collections")

  const { regions, isLoading: isLoadingRegions } = useMedusa("regions")

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
        valid_for: items,
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

    if (!isPercentageDiscount) {
      data.rule.value = data.rule.value * 100
    }
    data.rule.type = isPercentageDiscount ? "percentage" : "fixed"
    data.rule.allocation = isAllocatedToItem ? "item" : "total"

    if (data.rule.allocation === "item")
      data.rule.valid_for = items.map(p => p.value)
    data.regions = validRegions()

    const discount = {
      code: data.code,
      is_dynamic: isDynamic, //data.is_dynamic === "true",
      rule: data.rule,
      starts_at: moment(startDate).format("MM/DD/YYYY HH:mm"),
      ends_at: endDate ? moment(endDate).format("MM/DD/YYYY HH:mm") : undefined,
      regions: data.regions || [],
      valid_duration: isDynamic ? iso8601Date : undefined,
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
      .catch(error => {
        toaster("Error creating discount", "error")
      })
  }

  if (isLoadingRegions) {
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
      setIsPercentageDiscount(true)
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
            limitedWidth={true}
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
            type="number"
            name="usage_limit"
            placeholder="5"
            min="0"
            ref={register}
          />
        </Box>
        <Flex
          width={3 / 4}
          justifyContent="space-between"
          alignItems="center"
          mb={4}
        >
          <Pill
            width="50%"
            onClick={() => setIsFreeShipping(false)}
            active={!isFreeShipping}
            mr={4}
          >
            <Text fontWeight="500">Discount</Text>
          </Pill>
          <Pill
            width="50%"
            onClick={() => {
              setIsFreeShipping(true)
            }}
            active={isFreeShipping}
          >
            <Text fontWeight="500">Free shipping</Text>
          </Pill>
        </Flex>
        <Box mb={5}>
          <StyledLabel>
            <Flex sx={{ cursor: "pointer" }} alignItems="center">
              <input
                type="checkbox"
                id="is_dynamic"
                checked={isDynamic}
                style={{ cursor: "pointer", marginRight: "5px" }}
                onChange={() => setIsDynamic(!isDynamic)}
              />
              <Flex alignItems="center">
                <Text fontSize="14px">This is a template discount</Text>{" "}
                <InfoTooltip
                  ml={2}
                  tooltipText={
                    "Template discounts allow you to define a set of rules that can be used across a group of discounts. This is useful in campaigns that should generate unique codes for each user, but where the rules for all unique codes should be the same."
                  }
                />
              </Flex>
            </Flex>
          </StyledLabel>
        </Box>

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
        {/* <Flex> */}
        <Flex flexDirection="column">
          <Flex flexDirection="column">
            <RequiredLabel pb={2} style={{ fontWeight: 500 }}>
              Type
            </RequiredLabel>
            <Flex
              width={3 / 4}
              justifyContent="space-between"
              alignItems="center"
              mb={4}
            >
              <Pill
                disabled={isFreeShipping}
                width="50%"
                onClick={() => setIsPercentageDiscount(true)}
                active={isPercentageDiscount && !isFreeShipping}
                mr={4}
              >
                <Text fontWeight="500">Percentage</Text>
              </Pill>
              <Flex
                width={1 / 2}
                data-tip="Fixed amounts are not allowed for multi-regional discounts"
                data-for="amount-tooltip"
              >
                <Pill
                  disabled={isFreeShipping || selectedRegions.length > 1}
                  width="100%"
                  onClick={() => setIsPercentageDiscount(false)}
                  active={!isPercentageDiscount && !isFreeShipping}
                >
                  <Flex alignItems="center" justifyContent="center">
                    <Text
                      mr={selectedRegions.length > 1 ? 2 : 0}
                      fontWeight="500"
                    >
                      Fixed Amount{" "}
                    </Text>
                    {selectedRegions.length > 1 ? (
                      <InfoIcon
                        style={{
                          fill: "#c4c4c4",
                          display: "block",
                        }}
                      />
                    ) : (
                      ""
                    )}
                  </Flex>
                </Pill>
              </Flex>
            </Flex>
          </Flex>
          <Flex flexDirection="column">
            <RequiredLabel pb={2} style={{ fontWeight: 500 }}>
              Allocation
            </RequiredLabel>
            <Flex
              width={3 / 4}
              justifyContent="space-between"
              alignItems="center"
              mb={4}
            >
              <Pill
                disabled={isFreeShipping}
                width="50%"
                onClick={() => setIsAllocatedToItem(false)}
                active={!isAllocatedToItem && !isFreeShipping}
                mr={4}
              >
                <Text fontWeight="500">Total</Text>
              </Pill>
              <Pill
                disabled={isFreeShipping}
                width="50%"
                onClick={() => setIsAllocatedToItem(true)}
                active={isAllocatedToItem && !isFreeShipping}
              >
                <Text fontWeight="500">Item</Text>
              </Pill>
            </Flex>
          </Flex>
        </Flex>
        {isAllocatedToItem && (
          <>
            <RequiredLabel pb={2} style={{ fontWeight: 500 }}>
              Items
            </RequiredLabel>
            <Text fontSize={1}>Valid for items where: </Text>
            <Flex mt={2}>
              <Text mt={1} fontSize={1}>
                Product in
              </Text>
              <ProductSelection
                selectedProducts={items}
                setSelectedProducts={setItems}
              />
            </Flex>
          </>
        )}
        <Flex
          width={3 / 4}
          mb={3}
          flexDirection={["column", "columnn", "columnn", "row"]}
          justifyContent="space-between"
          alignItems="center"
        >
          <Flex
            width={[1, 1, 1, 1 / 2]}
            mr={[0, 0, 0, 4]}
            mb={[2, 2, 2, 0]}
            flexDirection="column"
          >
            <StyledLabel pb={2} style={{ fontWeight: 500 }}>
              Start date
            </StyledLabel>
            <DatePicker
              date={startDate}
              onChange={setStartDate}
              enableTimepicker={true}
            />
          </Flex>
          <Flex width={[1, 1, 1, 1 / 2]} flexDirection="column">
            <StyledLabel pb={2} style={{ fontWeight: 500 }}>
              End date
            </StyledLabel>
            <DatePicker
              date={endDate}
              onChange={setEndDate}
              enableTimepicker={true}
            />
          </Flex>
        </Flex>
        {isDynamic && (
          <Flex width={3 / 5}>
            <AvailabilityDuration
              setIsoString={setIso8601Date}
              existingIsoString=""
            />
          </Flex>
        )}
      </Flex>

      <Flex mt={4}>
        <Box ml="auto" />
        <Button variant={"cta"} type="submit">
          Save
        </Button>
      </Flex>
      <Tooltip id={"amount-tooltip"} disable={selectedRegions.length <= 1} />
    </Flex>
  )
}

export default NewDiscount
