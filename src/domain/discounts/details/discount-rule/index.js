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
import Button from "../../../../components/button"
import Typography from "../../../../components/typography"

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

const DiscountRuleModal = ({ discount, onUpdate, onDismiss, products }) => {
  const { register, handleSubmit } = useForm()
  const [discountRule, setDiscountRule] = useState(discount.rule)
  const [type, setType] = useState(discount.rule.type)
  const [allocation, setAllocation] = useState(discount.rule.allocation)

  const [selectedProducts, setSelectedProducts] = useState(
    discount.rule.valid_for.map(p => {
      return {
        label: p.title,
        value: p.id,
      }
    }) || []
  )

  const onChange = e => {
    const { name, value } = e.currentTarget
    setDiscountRule(prevState => ({ ...prevState, [name]: value }))
  }

  const onSubmit = data => {
    data.value = parseInt(data.value)
    data.valid_for = selectedProducts.map(p => p.value)
    data.id = discount.rule.id
    onUpdate(data)
  }

  return (
    <Modal onClick={onDismiss}>
      <Modal.Body
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{ height: "75vh" }}
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
            value={
              discountRule.type === "fixed"
                ? parseInt(discountRule.value) / 100
                : discountRule.value
            }
            onChange={onChange}
          />
          <RequiredLabel pb={2}>Type</RequiredLabel>
          <StyledLabel>
            <Flex alignItems="center">
              <input
                type="radio"
                ref={register({ required: true })}
                id="percentage"
                name="type"
                value="percentage"
                checked={type === "percentage"}
                onChange={() => setType("percentage")}
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
                name="type"
                value="fixed"
                checked={type === "fixed"}
                onChange={() => setType("fixed")}
                disabled={discount.regions.length > 1}
                style={{ marginRight: "5px" }}
              />
              <Text fontSize="12px" color="gray">
                Fixed amount{" "}
                {discount.regions.length > 1 ? (
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
                name="allocation"
                checked={allocation === "total"}
                onChange={() => setAllocation("total")}
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
                name="allocation"
                value="item"
                checked={allocation === "item"}
                onChange={() => setAllocation("item")}
                style={{ marginRight: "5px" }}
              />
              <Text fontSize="12px" color="gray">
                Item (discount is applied to specific items)
              </Text>
            </Flex>
          </StyledLabel>
          {allocation === "item" && (
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
                  selectedProducts={selectedProducts}
                  setSelectedProducts={setSelectedProducts}
                />
              </Flex>
            </>
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
