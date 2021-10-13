import { isEmpty } from "lodash"
import React from "react"
import { Box, Text } from "rebass"
import { formatAddress } from "../../../../../utils/format-address"

const SwapShippingInformation = ({ swap, fontColor }) => {
  return (
    <Box>
      <Text color={fontColor} fontSize={12} fontWeight={500} mb={2}>
        Shipping Address
      </Text>
      {!isEmpty(swap.shipping_address) ? (
        <Box color={fontColor} fontSize={12}>
          <Text>{swap.shipping_address.address_1}</Text>
          {swap.shipping_address.address_2 && (
            <Text pt={2}>{swap.shipping_address.address_2}</Text>
          )}
          <Text pt={2}>{formatAddress(swap.shipping_address)}</Text>
        </Box>
      ) : (
        <Text fontSize={12} color={fontColor}>
          No shipping for this order
        </Text>
      )}
    </Box>
  )
}

export default SwapShippingInformation
