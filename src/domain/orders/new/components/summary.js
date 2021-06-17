import React, { useEffect, useState } from "react"
import { Box, Flex, Image, Text } from "rebass"
import Input from "../../../../components/input"
import ImagePlaceholder from "../../../../assets/svg/image-placeholder.svg"
import Button from "../../../../components/button"
import Medusa from "../../../../services/api"
import styled from "@emotion/styled"
import {
  displayUnitPrice,
  extractOptionPrice,
  extractUnitPrice,
} from "../../../../utils/prices"

const Cross = styled.span`
  margin-left: 5px;
  cursor: pointer;
`

const Summary = ({
  items,
  handleAddQuantity,
  showCustomPrice,
  customOptionPrice,
  regions,
  form,
}) => {
  const [showAddDiscount, setShowAddDiscount] = useState(false)
  const [checkingDiscount, setCheckingDiscount] = useState(false)
  const [discError, setDiscError] = useState(false)
  const [code, setCode] = useState()

  const {
    shipping,
    billing,
    email,
    region,
    discount,
    requireShipping,
    shippingOption,
  } = form.watch([
    "shipping",
    "billing",
    "email",
    "region",
    "discount",
    "requireShipping",
    "shippingOption",
  ])

  const handleAddDiscount = async () => {
    setCheckingDiscount(true)

    try {
      const { data } = await Medusa.discounts.retrieveByCode(code)
      // if no discount is found
      if (!data.discount) {
        setDiscError(true)
        return
      }

      // if discount is not available in region
      if (!data.discount.regions.find(d => d.id === region.id)) {
        setDiscError(true)
      }

      setCode("")
      setShowAddDiscount(false)
      form.setValue("discount", data.discount)
    } catch (error) {
      setDiscError(true)
      console.log(error)
    }
    setCheckingDiscount(false)
  }

  const onDiscountRemove = () => {
    form.setValue("discount", {})
    setShowAddDiscount(false)
    setCode("")
  }

  useEffect(() => {
    form.register("discount")
  }, [])

  return (
    <Flex flexDirection="column" minHeight="550px">
      <Text fontSize={1} mb={3} pb={3} fontWeight="600">
        Order summary
      </Text>
      <Text fontSize={1} mb={2} fontWeight="600">
        Items
      </Text>
      {items.map((item, index) => {
        let displayPrice = displayUnitPrice(item, region)

        return (
          <Flex
            key={item.variant_id}
            justifyContent="space-between"
            py={2}
            pr={2}
            alignItems="center"
          >
            <Flex maxWidth="10%" height="100%">
              <Image
                src={item?.product?.thumbnail || ImagePlaceholder}
                height={30}
                width={30}
                p={!item?.product?.thumbnail && "8px"}
                sx={{ objectFit: "contain", border: "1px solid lightgray" }}
              />
            </Flex>
            <Flex
              width={"35%"}
              px={2}
              py={1}
              height="100%"
              flexDirection="column"
            >
              <Text fontSize="12px" lineHeight={"14px"}>
                {item.title}
              </Text>
              {item?.product?.title && (
                <Text fontSize="12px" lineHeight={"14px"}>
                  {item.product.title}
                </Text>
              )}
            </Flex>
            <Box width={"15%"} px={2} py={1}>
              <Input
                type="number"
                fontSize="12px"
                onChange={e => handleAddQuantity(e, index)}
                value={item.quantity || ""}
              />
            </Box>
            <Box width={"30%"} px={2} py={1}>
              <Text fontSize="12px">{displayPrice}</Text>
            </Box>
          </Flex>
        )
      })}
      <Flex flexDirection="column">
        {!showAddDiscount && !discount?.rule && (
          <Button
            mt={2}
            fontSize="12px"
            variant="primary"
            width="140px"
            mb={2}
            onClick={() => setShowAddDiscount(true)}
          >
            {showAddDiscount ? "Submit" : "Add discount"}
          </Button>
        )}
        {showAddDiscount && !discount?.rule && (
          <Flex flexDirection="column">
            <Flex width="140px" mt={2}>
              <Input
                type="text"
                placeholder="SUMMER10"
                invalid={discError}
                onFocus={() => setDiscError(false)}
                fontSize="12px"
                onChange={({ currentTarget }) => setCode(currentTarget.value)}
                value={code || null}
              />
              <Flex
                px={2}
                alignItems="center"
                onClick={() => setShowAddDiscount(false)}
              >
                &times;
              </Flex>
            </Flex>
            <Button
              fontSize="10px"
              mt={2}
              variant="primary"
              width="115px"
              loading={checkingDiscount}
              onClick={() => handleAddDiscount()}
            >
              Add
            </Button>
          </Flex>
        )}
      </Flex>
      {discount?.rule && (
        <Flex flexDirection="column" mt={2} pb={3}>
          <Text
            fontSize={1}
            mb={2}
            pt={3}
            fontWeight="600"
            sx={{ borderTop: "hairline" }}
          >
            Discount
            <Cross onClick={() => onDiscountRemove()}>&times;</Cross>
          </Text>
          <Flex>
            <Text fontSize="12px" mr={3} fontStyle="italic" width="70px">
              Code
            </Text>
            <Text fontSize="12px" mr={3}>
              {discount.code}
            </Text>
          </Flex>
          <Flex>
            <Text fontSize="12px" mr={3} fontStyle="italic" width="70px">
              Type
            </Text>
            <Text fontSize="12px" mr={3}>
              {discount.rule.type}
            </Text>
          </Flex>
          <Flex>
            <Text fontSize="12px" mr={3} fontStyle="italic" width="70px">
              Value
            </Text>
            <Text fontSize="12px" mr={3}>
              {discount.rule.value}
            </Text>
          </Flex>
        </Flex>
      )}
      <Flex flexDirection="column" mt={2} pb={3}>
        <Text
          fontSize={1}
          mb={2}
          pt={3}
          fontWeight="600"
          sx={{ borderTop: "hairline" }}
        >
          Customer
        </Text>
        <Flex>
          <Text fontSize="12px" mr={3} fontStyle="italic" width="70px">
            Email:
          </Text>
          <Text fontSize="12px" mr={3}>
            {email}
          </Text>
        </Flex>
      </Flex>
      {requireShipping && (
        <Flex
          flexDirection="column"
          mt={2}
          pb={3}
          sx={{ borderBottom: "hairline" }}
        >
          <Text
            fontSize={1}
            mb={2}
            pt={3}
            fontWeight="600"
            sx={{ borderTop: "hairline" }}
          >
            Shipping details
          </Text>
          <Flex>
            <Text fontSize="12px" mr={3} fontStyle="italic" width="70px">
              Address:
            </Text>
            <Text fontSize="12px" mr={3}>
              {shipping.first_name} {shipping.last_name}
            </Text>
            <Text fontSize="12px">
              {shipping.address_1}, {shipping.address_2} {shipping.postal_code}{" "}
              {shipping.city} {shipping.country_code.toUpperCase()}
            </Text>
          </Flex>
          <Flex>
            <Text fontSize="12px" mr={3} fontStyle="italic" width="70px">
              Method:
            </Text>
            <Text fontSize="12px" mr={3}>
              {shippingOption.name} -{" "}
              {showCustomPrice && customOptionPrice ? (
                <>
                  <strike style={{ marginRight: "5px" }}>
                    {extractOptionPrice(shippingOption.amount, region)}
                  </strike>
                  {customOptionPrice} {region.currency_code.toUpperCase()}
                </>
              ) : (
                extractOptionPrice(shippingOption.amount, region)
              )}
            </Text>
          </Flex>
        </Flex>
      )}
      <Flex flexDirection="column" mt={2} pb={3}>
        <Text fontSize={1} mb={2} pt={3} fontWeight="600">
          Billing details
        </Text>
        <Flex>
          <Text fontSize="12px" mr={3} fontStyle="italic" width="70px">
            Address:
          </Text>
          <Text fontSize="12px" mr={3}>
            {billing.first_name} {billing.last_name}
          </Text>
          <Text fontSize="12px">
            {billing.address_1}, {billing.address_2} {billing.postal_code}{" "}
            {billing.city} {billing.country_code.toUpperCase()}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Summary
