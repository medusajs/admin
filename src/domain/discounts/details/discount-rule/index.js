import React, { useState } from "react"
import { Text, Flex } from "rebass"
import { useForm } from "react-hook-form"
import { Label } from "@rebass/forms"
import styled from "@emotion/styled"
import _ from "lodash"

import ProductSelection from "../../product-selection"
import Modal from "../../../../components/modal"
import MultiSelect from "react-multi-select-component"
import Input from "../../../../components/input"
import Pill from "../../../../components/pill"
import Button from "../../../../components/button"
import Typography from "../../../../components/typography"
import DatePicker from "../../../../components/date-picker/date-picker"
import Tooltip from "../../../../components/tooltip"
import AvailabilityDuration from "../../../../components/availability-duration"
import { ReactComponent as InfoIcon } from "../../../../assets/svg/info.svg"
import { displayAmount, persistedPrice } from "../../../../utils/prices"

const StyledLabel = styled(Label)`
  ${Typography.Base}

  input[type="radio"]:checked ~ svg {
    color: #79b28a;
  }
`

const StyledMultiSelect = styled(MultiSelect)`
  ${Typography.Base}

  color: black;
  background-color: white;

  max-width: 400px;
  text-overflow: ellipsis;

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

const DiscountRuleModal = ({
  selectedRegions,
  discount,
  onUpdate,
  onDismiss,
  products,
}) => {
  const { register, handleSubmit } = useForm()
  const [discountRule, setDiscountRule] = useState(discount.rule)
  const [type, setType] = useState(discount.rule.type)

  const [isPercentageDiscount, setIsPercentageDiscount] = useState(
    discount.rule.type === "percentage"
  )
  const [allocation, setAllocation] = useState(discount.rule.allocation)
  const [isAllocatedToItem, setIsAllocatedToItem] = useState(
    discount.rule.allocation === "item"
  )
  const [startDate, setStartDate] = useState(new Date(discount.starts_at))
  const [endDate, setEndDate] = useState(
    discount.ends_at ? new Date(discount.ends_at) : discount.ends_at
  )
  const [iso8601Duration, setIso8601Duration] = useState(undefined)

  const [selectedProducts, setSelectedProducts] = useState(
    discount.rule.valid_for?.map(p => {
      return {
        label: p.title,
        value: p.id,
      }
    }) || []
  )

  const [showRule, setShowRule] = useState(discount.rule.valid_for?.length > 0)

  const [value, setValue] = useState(
    isPercentageDiscount
      ? discountRule.value
      : displayAmount(selectedRegions[0].currency_code, discountRule.value)
  )

  const onChange = e => {
    const { name, value } = e.currentTarget
    setDiscountRule(prevState => ({ ...prevState, [name]: value }))
  }

  const onSubmit = data => {
    data.value = parseInt(data.value)
    data.valid_for = selectedProducts.map(p => p.value)
    data.id = discount.rule.id
    data.type = isPercentageDiscount ? "percentage" : "fixed"
    data.allocation = isAllocatedToItem ? "item" : "total"
    data.value = isPercentageDiscount
      ? parseInt(value)
      : persistedPrice(selectedRegions[0].currency_code, parseInt(value))

    const result = {
      rule: data,
      is_dynamic: discount.is_dynamic,
      starts_at: startDate.toUTCString(),
      ends_at: endDate ? endDate.toUTCString() : undefined,
      valid_duration: iso8601Duration,
    }

    onUpdate(result)
  }

  const handleSetShowRule = value => {
    setSelectedProducts([])
    setShowRule(value)
  }

  return (
    <Modal onClick={onDismiss}>
      <Modal.Body
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        // sx={{ height: "75vh" }}
      >
        <Modal.Header>Update discount rule</Modal.Header>
        <Modal.Content flexDirection="column">
          <Input
            mb={3}
            ref={register({ required: true })}
            label="Description"
            required={true}
            name="description"
            value={discountRule.description}
            onChange={onChange}
          />
          <Input
            mb={3}
            ref={register({ required: true })}
            label="Value"
            type="number"
            required={true}
            name="value"
            value={value}
            onChange={event => setValue(event.target.value)}
          />
          <Flex mb={3} flexDirection="column">
            <RequiredLabel pb={2}>Type</RequiredLabel>
            <Flex width={1} justifyContent="space-between">
              <Pill
                width="50%"
                onClick={() => setIsPercentageDiscount(true)}
                active={isPercentageDiscount}
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
                  disabled={selectedRegions.length > 1}
                  width="100%"
                  onClick={() => setIsPercentageDiscount(false)}
                  active={!isPercentageDiscount}
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
                    <Tooltip
                      id={"amount-tooltip"}
                      disable={selectedRegions.length <= 1}
                    />
                  </Flex>
                </Pill>
              </Flex>
            </Flex>
          </Flex>
          <RequiredLabel pb={2}>Allocation</RequiredLabel>
          <Flex pb={3} justifyContent="space-between" alignItems="center">
            <Pill
              width="50%"
              onClick={() => setIsAllocatedToItem(false)}
              active={!isAllocatedToItem}
              mr={4}
            >
              <Text fontWeight="500">Total</Text>
            </Pill>
            <Pill
              width="50%"
              onClick={() => setIsAllocatedToItem(true)}
              active={isAllocatedToItem}
            >
              <Text fontWeight="500">Item</Text>
            </Pill>
          </Flex>
          <RequiredLabel pb={2} style={{ fontWeight: 500 }}>
            Items
          </RequiredLabel>
          <Text fontSize={1}>Valid for items where: </Text>

          <Flex mt={2}>
            {showRule && (
              <ProductSelection
                sx={{ width: "100%" }}
                mt={1}
                selectedProducts={selectedProducts}
                setSelectedProducts={setSelectedProducts}
                onRemove={() => handleSetShowRule(false)}
              />
            )}

            {!showRule && (
              <Text
                onClick={() => handleSetShowRule(true)}
                sx={{
                  marginBottom: 10,
                  cursor: "pointer",
                  fontWeight: "700",
                  fontSize: 14,
                  color: "#ACB4FF",
                  transition: "color 0.2s ease-in",
                  "&:hover": { color: "#5469D3" },
                }}
              >
                + Add a rule
              </Text>
            )}
          </Flex>

          <Flex
            mb={3}
            flexDirection={["column", "columnn", "columnn", "row"]}
            justifyContent="space-between"
          >
            <Flex width={1 / 2} mr={4} flexDirection="column">
              <StyledLabel pb={2}>Start date</StyledLabel>
              <DatePicker
                date={startDate}
                onChange={setStartDate}
                enableTimepicker={true}
              />
            </Flex>
            <Flex width={1 / 2} flexDirection="column">
              <StyledLabel pb={2}>End date</StyledLabel>
              <DatePicker
                date={endDate}
                onChange={setEndDate}
                enableTimepicker={true}
              />
            </Flex>
          </Flex>
          {discount.is_dynamic && (
            <AvailabilityDuration
              setIsoString={setIso8601Duration}
              existingIsoString={discount.valid_duration || ""}
            />
          )}
        </Modal.Content>
        <Modal.Footer justifyContent="flex-end">
          <Button type="submit" variant="primary">
            Save
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default DiscountRuleModal
