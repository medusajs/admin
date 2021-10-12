import React from "react"
import { navigate } from "gatsby"
import { Text, Flex, Box, Image } from "rebass"
import styled from "@emotion/styled"
import Typography from "../../../../components/typography"
import { displayUnitPrice } from "../../../../utils/prices"
import { ReactComponent as ImagePlaceholder } from "../../../../assets/svg/image-placeholder.svg"
const LineItemLabel = styled(Text)`
  ${Typography.Base};

  cursor: pointer;

  font-size: 10px;
`

const LineItem = ({ fontColor, lineItem, order }) => {
  const productId = lineItem?.variant?.product_id || undefined

  return (
    <Flex alignItems="center" py={2}>
      <Flex pr={3}>
        <Box alignSelf={"center"} color={fontColor} minWidth={"35px"}>
          {lineItem.quantity} x
        </Box>
        <Box mx={2}>
          <Flex width="30px" height="30px">
            <Image
              src={lineItem.thumbnail || ImagePlaceholder}
              height={30}
              width={30}
              p={!lineItem.thumbnail && "8px"}
              sx={{
                objectFit: "contain",
                border: "1px solid lightgray",
              }}
            />
          </Flex>
        </Box>
        <Box>
          <LineItemLabel
            ml={2}
            mr={5}
            color={fontColor}
            onClick={() => {
              if (productId) {
                navigate(`/a/products/${productId}`)
              }
            }}
          >
            {lineItem.title}
            <br /> {lineItem?.variant?.sku || "-"}
            <br />
            {displayUnitPrice(lineItem, order.region)}
          </LineItemLabel>
        </Box>
      </Flex>
    </Flex>
  )
}

export default LineItem
