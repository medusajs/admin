import React, { useState, useEffect } from "react"
import { Text, Flex, Box, Image } from "rebass"
import styled from "@emotion/styled"
import moment from "moment"

import Typography from "../../../../components/typography"
import Button from "../../../../components/button"
import Dropdown from "../../../../components/dropdown"

const LineItemLabel = styled(Text)`
  ${Typography.Base};

  cursor: pointer;

  font-size: 10px;
`

const LineItem = ({ lineItem, currency, taxRate }) => {
  const productId = lineItem.variant.product_id

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
            {((1 + taxRate / 100) * lineItem.unit_price) / 100}{" "}
            {currency.toUpperCase()}
          </LineItemLabel>
        </Box>
      </Flex>
    </Flex>
  )
}

export default ({ event, order, onReceiveReturn, onCancelReturn, toaster }) => {
  const canceled = event.raw.status === "canceled"
  const [expanded, setExpanded] = useState(!canceled)

  useEffect(() => {
    setExpanded(event.raw.status !== "canceled")
  }, [event])

  const cancelReturn = () => {
    return onCancelReturn(event.raw.id)
      .then()
      .catch(error => {
        const errorData = error.response.data.message
        toaster(`${errorData}`, "error")
      })
  }

  return (
    <Box sx={{ borderBottom: "hairline" }} pb={3} mb={3} px={3}>
      <Flex justifyContent="space-between">
        <Text fontSize={1} color="grey" fontWeight="500">
          Return {event.status}
        </Text>
        {canceled && (
          <Text
            sx={{
              fontWeight: "500",
              color: "#89959C",
              ":hover": {
                color: "black",
              },
              cursor: "pointer",
            }}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Hide" : "Show"}
          </Text>
        )}
      </Flex>
      {expanded && (
        <>
          <Text fontSize="11px" color="grey" mb={3}>
            {moment(event.time).format("MMMM Do YYYY, H:mm:ss")}
          </Text>
          {(event.no_notification || false) !==
            (order.no_notification || false) && (
            <Box mt={2} pr={2}>
              <Text color="gray">
                Notifications related to this return are
                {event.no_notification ? " disabled" : " enabled"}.
              </Text>
            </Box>
          )}
          <br />
          <Flex justifyContent="space-between">
            <Text fontSize={1} color="grey" fontWeight="500">
              Return{" "}
              {canceled
                ? event.items.map(e => ` '${e.title}' `) + "canceled."
                : event.status}
            </Text>
            {!canceled && event.raw.status !== "received" && (
              <Flex>
                <Button
                  onClick={() => onReceiveReturn(event.raw)}
                  variant={"primary"}
                  mr={2}
                >
                  Receive return
                </Button>
                <Dropdown>
                  <Text color="danger" onClick={cancelReturn}>
                    Cancel return
                  </Text>
                </Dropdown>
              </Flex>
            )}
          </Flex>
          <Box>
            <Flex justifyContent="space-between">
              <Box>
                <Text fontSize="11px" color="grey" mb={3}>
                  {moment(event.time).format("MMMM Do YYYY, H:mm:ss")}
                </Text>
              </Box>
            </Flex>
            <Flex justifyContent="space-between">
              <Box>
                {event.items.map(lineItem => (
                  <LineItem
                    key={lineItem._id}
                    currency={order.currency_code}
                    lineItem={lineItem}
                    taxRate={order.region.tax_rate}
                    onReceiveReturn={onReceiveReturn}
                    rawEvent={event.raw}
                  />
                ))}
              </Box>
            </Flex>
          </Box>
        </>
      )}
    </Box>
  )
}
