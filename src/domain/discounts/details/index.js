import React, { useState, useRef, useEffect } from "react"
import { Text, Flex, Box, Image } from "rebass"
import { navigate } from "gatsby"
import ReactJson from "react-json-view"
import styled from "@emotion/styled"
import MultiSelect from "react-multi-select-component"
import _ from "lodash"

import Card from "../../../components/card"
import Spinner from "../../../components/spinner"
import Badge from "../../../components/badge"
import Button from "../../../components/button"
import EditableInput from "../../../components/editable-input"

import useMedusa from "../../../hooks/use-medusa"
import DiscountRuleModal from "./discount-rule"
import { Input } from "@rebass/forms"
import Typography from "../../../components/typography"

const StyledMultiSelect = styled(MultiSelect)`
  ${Typography.Base}

  color: black;
  background-color: white;

  max-width: 400px;
  text-overflow: ellipsis;

  min-width: 200px;

  line-height: 1.5;
  margin-top: 8px;
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

const Divider = props => (
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

const DiscountDetails = ({ id }) => {
  const [updating, setUpdating] = useState(false)
  const [showRuleEdit, setShowRuleEdit] = useState(false)
  const [code, setCode] = useState(discount && discount.code)

  const [selectedRegions, setSelectedRegions] = useState([])

  const discountCodeRef = useRef()

  const { discount, update, refresh, isLoading, toaster } = useMedusa(
    "discounts",
    {
      id,
    }
  )
  const { products, isLoading: isLoadingProducts } = useMedusa("products")
  const { regions } = useMedusa("regions")

  useEffect(() => {
    if (discount) {
      setCode(discount.code)
    }
  }, [discount])

  useEffect(() => {
    if (regions && discount && discount.regions) {
      const temp = regions.reduce((acc, next) => {
        if (discount.regions.map(r => r.id).includes(next.id)) {
          acc.push({ label: next.name, value: next.id })
        }
        return acc
      }, [])
      setSelectedRegions(temp)
    }
  }, [regions, discount])

  if (isLoading || updating || !discount || !regions) {
    return (
      <Flex flexDirection="column" alignItems="center" height="100vh" mt="auto">
        <Box height="75px" width="75px" mt="50%">
          <Spinner dark />
        </Box>
      </Flex>
    )
  }

  const onTitleBlur = () => {
    if (discount.code === code) return

    update({
      code: code,
    })
      .then(() => {
        refresh({ id })
        setUpdating(false)
        toaster("Discount updated", "success")
      })
      .catch(() => {
        setUpdating(false)
        toaster("Discount update failed", "error")
      })
  }

  const handleDisabled = () => {
    setUpdating(true)
    update({
      is_disabled: discount.is_disabled ? false : true,
    })
      .then(() => {
        refresh({ id })
        setUpdating(false)
        toaster("Discount updated", "success")
      })
      .catch(() => {
        setUpdating(false)
        toaster("Discount update failed", "error")
      })
  }

  const handleDiscountRuleUpdate = data => {
    setUpdating(true)
    update({
      rule: data,
    })
      .then(() => {
        refresh({ id })
        setUpdating(false)
        setShowRuleEdit(false)
        toaster("Discount rule updated", "success")
      })
      .catch(() => {
        setUpdating(false)
        setShowRuleEdit(false)
        toaster("Discount rule update failed", "error")
      })
  }

  const handleRegionUpdate = data => {
    const toUpdateWith = regions.reduce((acc, next) => {
      if (data.map(el => el.value).includes(next.id)) {
        acc.push(next.id)
      }
      return acc
    }, [])

    setUpdating(true)
    update({
      regions: toUpdateWith,
    })
      .then(() => {
        refresh({ id })
        setUpdating(false)
        toaster("Discount updated", "success")
      })
      .catch(() => {
        setUpdating(false)
        toaster("Discount update failed", "error")
      })
  }

  const renderDiscountValue = discountRule => {
    let val = discountRule.value

    if (discountRule.type === "fixed") {
      const currency = discount.regions[0].currency_code
      const vat = discount.regions[0].tax_rate
      val = parseInt(val / 100)
      return `${val.toFixed(2)} ${currency.toUpperCase()} ${
        vat > 0 ? `(Excl. VAT)` : ``
      }`
    } else {
      return `${val} %`
    }
  }

  return (
    <Flex flexDirection="column" mb={5} pt={5}>
      <Card mb={2}>
        <Card.Header
          action={{
            label: discount.is_disabled ? "Enable" : "Disable",
            onClick: () => handleDisabled(),
          }}
        >
          {discount.id}
        </Card.Header>
        <Box display="flex" flexDirection="column">
          {code && (
            <EditableInput
              text={code}
              childRef={discountCodeRef}
              type="input"
              style={{ maxWidth: "400px" }}
              onBlur={onTitleBlur}
            >
              <Input
                m={3}
                ref={discountCodeRef}
                type="text"
                name="code"
                value={code}
                onChange={e => setCode(e.target.value)}
              />
            </EditableInput>
          )}
          <Flex flexDirection="row" mb={3}>
            <Box pl={3} pr={5}>
              <Text pt={2} color="gray">
                Usage limit
              </Text>
              <Text pt={2} color="gray">
                Usage count
              </Text>
            </Box>
            <Box px={3}>
              <Text pt={2}>{discount.usage_limit || "N / A"}</Text>
              <Text pt={2}>{discount.usage_count}</Text>
            </Box>
          </Flex>
        </Box>
        <Card.Body>
          <Box pl={3} pr={2}>
            <Text pb={1} color="gray">
              Valid regions
            </Text>
            <StyledMultiSelect
              options={
                regions &&
                regions.map(el => ({
                  label: el.name,
                  value: el.id,
                }))
              }
              selectAllLabel={"All"}
              overrideStrings={{
                allItemsAreSelected: "All regions",
              }}
              value={selectedRegions}
              onChange={setSelectedRegions}
            />
          </Box>
          <Box ml="auto" />
          <Flex mr={3} mt="auto">
            <Button
              disabled={_.isEqual(
                selectedRegions.map(r => r.value),
                discount.regions.map(r => r.id)
              )}
              variant="primary"
              onClick={() => handleRegionUpdate(selectedRegions)}
            >
              Save valid regions
            </Button>
          </Flex>
        </Card.Body>
      </Card>
      <Card mb={2}>
        <Card.Header
          action={
            discount.rule.type !== "free_shipping" && {
              label: "Edit",
              type: "primary",
              onClick: () => setShowRuleEdit(true),
            }
          }
        >
          Discount rule
        </Card.Header>
        <Card.Body flexDirection="column">
          <Box display="flex" flexDirection="row">
            <Box pl={3} pr={5}>
              <Text color="gray">Description</Text>
              {discount.rule.type !== "free_shipping" ? (
                <>
                  <Text pt={2} color="gray">
                    Value
                  </Text>
                  <Text pt={2} color="gray">
                    Allocation
                  </Text>
                </>
              ) : (
                <Text pt={2} color="gray">
                  Type
                </Text>
              )}
            </Box>
            <Box px={3}>
              <Text>{discount.rule.description || "Missing description"}</Text>
              {discount.rule.type !== "free_shipping" ? (
                <>
                  <Text pt={2}>{renderDiscountValue(discount.rule)}</Text>
                  <Text pt={2}>
                    {discount.rule.allocation === "total"
                      ? "Applies to total order amount"
                      : "Applies to specified items"}
                  </Text>
                </>
              ) : (
                <Text pt={2}>Free shipping</Text>
              )}
            </Box>
          </Box>
          <Divider m={3} />
          <Box>
            <Text ml={3} mb={2}>
              Applicable for all products
            </Text>
          </Box>
        </Card.Body>
      </Card>
      <Card mr={3} width="100%">
        <Card.Header>Raw discount</Card.Header>
        <Card.Body>
          <ReactJson
            name={false}
            collapsed={true}
            src={discount}
            style={{ marginLeft: "20px" }}
          />
        </Card.Body>
      </Card>
      {showRuleEdit && (
        <DiscountRuleModal
          discount={discount}
          onUpdate={handleDiscountRuleUpdate}
          onDismiss={() => setShowRuleEdit(false)}
          products={products}
          // selectedProducts={selectedProducts}
          // setSelectedProducts={setSelectedProducts}
        />
      )}
    </Flex>
  )
}

export default DiscountDetails
