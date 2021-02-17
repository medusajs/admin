import React from "react"
import { Box, Flex, Image, Text } from "rebass"
import Input from "../../../../components/input"
import ImagePlaceholder from "../../../../assets/svg/image-placeholder.svg"

const Summary = ({
  items,
  requireShipping,
  handleAddQuantity,
  selectedAddress,
  shippingOption,
  showCustomPrice,
  customOptionPrice,
  region,
  email,
  regions,
}) => {
  const extractOptionPrice = price => {
    const r = regions.find(reg => reg.id === region.id)
    let amount = price

    amount = (amount * (1 + r.tax_rate / 100)) / 100
    return `${amount} ${r.currency_code.toUpperCase()}`
  }

  const extractPrice = prices => {
    const reg = regions.find(r => r.id === region.id)
    let price = prices.find(ma => ma.currency_code === reg.currency_code)

    if (price) {
      return (price.amount * (1 + reg.tax_rate / 100)) / 100
    }

    return 0
  }

  return (
    <Flex flexDirection="column" minHeight="550px">
      <Text fontSize={1} mb={3} pb={3} fontWeight="600">
        Order summary
      </Text>
      <Text fontSize={1} mb={2} fontWeight="600">
        Items
      </Text>
      {items.map((item, index) => {
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
                sx={{
                  objectFit: "contain",
                  border: "1px solid lightgray",
                }}
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
              <Text fontSize="12px">
                {item.unit_price
                  ? item.unit_price.toFixed(2)
                  : `${extractPrice(item.prices).toFixed(2)} `}{" "}
                {region.currency_code.toUpperCase()}
              </Text>
            </Box>
          </Flex>
        )
      })}
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
              {selectedAddress.shipping_address.first_name}{" "}
              {selectedAddress.shipping_address.last_name}
            </Text>
            <Text fontSize="12px">
              {selectedAddress.shipping_address.address_1},{" "}
              {selectedAddress.shipping_address.address_2}{" "}
              {selectedAddress.shipping_address.postal_code}{" "}
              {selectedAddress.shipping_address.city}{" "}
              {selectedAddress.shipping_address.country_code.toUpperCase()}
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
                    {extractOptionPrice(shippingOption.amount)}
                  </strike>
                  {customOptionPrice} {region.currency_code.toUpperCase()}
                </>
              ) : (
                extractOptionPrice(shippingOption.amount)
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
            {selectedAddress.shipping_address.first_name}{" "}
            {selectedAddress.shipping_address.last_name}
          </Text>
          <Text fontSize="12px">
            {selectedAddress.shipping_address.address_1},{" "}
            {selectedAddress.shipping_address.address_2}{" "}
            {selectedAddress.shipping_address.postal_code}{" "}
            {selectedAddress.shipping_address.city}{" "}
            {selectedAddress.shipping_address.country_code.toUpperCase()}
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Summary
