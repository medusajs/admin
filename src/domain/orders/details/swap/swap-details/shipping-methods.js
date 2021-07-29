import React from "react"
import { Box, Text } from "rebass"

const formatDecimalAndCurrency = (amount, currency) => {
  const fixed = amount.toFixed(2)

  return `${fixed} ${currency.toUpperCase()}`
}

const SwapShippingMethods = ({ shipping_methods = [], taxRate, currency }) => {
  return (
    <>
      {shipping_methods?.length ? (
        shipping_methods.map(method => (
          <Box key={method._id}>
            <Box>
              <Text fontSize={12} color="#454B54">
                {method.shipping_option ? (
                  <>
                    {method.shipping_option.name} -{" "}
                    {formatDecimalAndCurrency(
                      ((100 + taxRate) * method.shipping_option.amount) / 10000,
                      currency
                    )}
                  </>
                ) : (
                  <span style={{ fontStyle: "italic" }}>
                    Order was shipped with a now deleted option
                  </span>
                )}
              </Text>
            </Box>
          </Box>
        ))
      ) : (
        <Text fontSize={12} fontStyle="italic" color="#454B54">
          No shipping for this order
        </Text>
      )}
    </>
  )
}

export default SwapShippingMethods
