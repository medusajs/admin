import React from "react"
import styled from "@emotion/styled"
import { Text, Flex, Box, Image } from "rebass"
import Typography from "../typography"

const LineItemLabel = styled(Text)`
  ${Typography.Base};

  cursor: pointer;

  font-size: 10px;
`

const LineItem = ({ fontColor, lineItem, currency, taxRate }) => {
  const productId = lineItem.variant.product.id

  return (
    <Flex alignItems="center">
      <Flex flex={1} alignItems="center">
        <Box color={fontColor} alignSelf={"center"} minWidth={"35px"}>
          {lineItem.quantity} x
        </Box>
        <Box mx={2}>
          <Image
            src={lineItem.thumbnail || ""}
            sx={{
              objectFit: "contain",
              objectPosition: "center",
              width: 35,
              height: 35,
            }}
          />
        </Box>
        <Box>
          <LineItemLabel
            ml={2}
            mr={5}
            color={fontColor}
            onClick={() => navigate(`/a/products/${productId}`)}
          >
            {lineItem.title}
            <br /> {lineItem.variant.sku}
            <br />
            {((100 + taxRate) * lineItem.unit_price) / 10000}{" "}
            {currency.toUpperCase()}
          </LineItemLabel>
        </Box>
      </Flex>
    </Flex>
  )
}

export default LineItem
