import React from "react"
import { Box, Flex, Image, Text } from "rebass"
import Typography from "../../../../components/typography"
import styled from "@emotion/styled"
import { navigate } from "gatsby"

const LineItemLabel = styled(Text)`
  ${Typography.Base};

  cursor: pointer;

  font-size: 10px;
`

const LineItem = ({ lineItem, currency, taxRate }) => {
  const productId = lineItem.variant.product.id

  return (
    <Flex alignItems="center">
      <Flex flex={1} alignItems="center">
        <Box alignSelf={"center"} minWidth={"35px"}>
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
