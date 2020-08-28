import React, { useState, useRef, useEffect } from "react"
import { Text, Flex, Box, Image } from "rebass"
import { navigate } from "gatsby"
import ReactJson from "react-json-view"
import styled from "@emotion/styled"

import Card from "../../../components/card"
import Spinner from "../../../components/spinner"
import Badge from "../../../components/badge"
import EditableInput from "../../../components/editable-input"

import useMedusa from "../../../hooks/use-medusa"
import DiscountRuleModal from "./discount-rule"
import { Input } from "@rebass/forms"

const ProductLink = styled(Text)`
  color: #006fbb;
  z-index: 1000;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
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
  const [selectedRegions, setSelectedRegions] = useState([])
  const [selectedProducts, setSelectedProducts] = useState(
    discount && discount.discount_rule ? discount.discount_rule.valid_for : []
  )
  const [updating, setUpdating] = useState(false)
  const [showRuleEdit, setShowRuleEdit] = useState(false)
  const [code, setCode] = useState(discount && discount.code)

  const discountCodeRef = useRef()

  const { discount, update, refresh, isLoading, toaster } = useMedusa(
    "discounts",
    {
      id,
    }
  )
  const { products, isLoading: isLoadingProducts } = useMedusa("products")

  useEffect(() => {
    if (discount) {
      setCode(discount.code)
    }
  }, [discount])

  if (isLoading || updating || !discount) {
    return (
      <Flex flexDirection="column" alignItems="center" height="100vh" mt="auto">
        <Box height="75px" width="75px" mt="50%">
          <Spinner dark />
        </Box>
      </Flex>
    )
  }

  const onTitleBlue = () => {
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
      disabled: discount.disabled ? false : true,
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
      discount_rule: data,
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

  return (
    <Flex flexDirection="column" mb={5}>
      <Card mb={2}>
        <Card.Header
          action={{
            label: discount.disabled ? "Enable" : "Disable",
            onClick: () => handleDisabled(),
          }}
        >
          {discount._id}
        </Card.Header>
        <Box>
          {code && (
            <EditableInput
              text={code}
              childRef={discountCodeRef}
              type="input"
              style={{ maxWidth: "400px" }}
              onBlur={onTitleBlue}
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
          {/* <Text p={3} fontWeight="bold">
            {discount.code}
          </Text> */}
        </Box>
        <Card.Body>
          <Box pl={3} pr={2}>
            <Text pb={1} color="gray">
              Disabled
            </Text>
            <Text pt={1} width="100%" textAlign="center">
              <Badge width="100%" color="#4f566b" bg="#e3e8ee">
                {`${discount.disabled}`}
              </Badge>
            </Text>
          </Box>
          <Card.VerticalDivider mx={3} />
          <Box pl={3} pr={2}>
            <Text pb={1} color="gray">
              Valid regions
            </Text>
            {discount.regions.map((r, i) => (
              <Text key={i} pt={1}>
                {r}
              </Text>
            ))}
          </Box>
          <Card.VerticalDivider mx={3} />
        </Card.Body>
      </Card>
      <Card mb={2}>
        <Card.Header
          action={{
            label: "Edit",
            type: "primary",
            onClick: () => setShowRuleEdit(true),
          }}
        >
          Discount rule
        </Card.Header>
        <Card.Body flexDirection="column">
          <Box display="flex" flexDirection="row">
            <Box pl={3} pr={5}>
              <Text color="gray">Description</Text>
              <Text pt={1} color="gray">
                Type
              </Text>
              <Text pt={1} color="gray">
                Value
              </Text>
              <Text pt={1} color="gray">
                Allocation method
              </Text>
            </Box>
            <Box px={3}>
              <Text>{discount.discount_rule.description}</Text>
              <Text pt={1}>{discount.discount_rule.type}</Text>
              <Text pt={1}>{discount.discount_rule.value}</Text>
              <Text pt={1}>{discount.discount_rule.allocation}</Text>
            </Box>
          </Box>
          <Divider m={3} />
          <Box>
            <Text ml={3} mb={2}>
              Applicable product(s)
            </Text>
            {discount.discount_rule.valid_for.map(product => (
              <Box
                key={product._id}
                pl={3}
                pr={2}
                py={2}
                display="flex"
                alignItems="center"
              >
                <Image
                  ml={3}
                  src={product.thumbnail || ""}
                  sx={{
                    objectFit: "contain",
                    width: 35,
                    height: 35,
                  }}
                />
                <Card.VerticalDivider mx={3} height="35px" />
                <ProductLink
                  onClick={() => navigate(`/a/products/${product._id}`)}
                >
                  {product.title}
                </ProductLink>
                <Card.VerticalDivider mx={3} height="35px" />
                <Text>{product.variants.length} variant(s)</Text>
              </Box>
            ))}
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
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
        />
      )}
    </Flex>
  )
}

export default DiscountDetails
