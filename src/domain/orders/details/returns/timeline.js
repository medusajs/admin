import React, { useState, useEffect } from "react"
import { Text, Flex, Box, Image } from "rebass"
import styled from "@emotion/styled"
import moment from "moment"

import Typography from "../../../../components/typography"
import Button from "../../../../components/button"
import Dropdown from "../../../../components/dropdown"
import LineItem from "../../../../components/line-item"
import SimpleEvent from "../timeline/simpleEvent"

export default ({ event, order, onReceiveReturn, onCancelReturn, toaster }) => {
  const fontColor = event.isLatest ? "#454B54" : "#89959C"
  const canceled = event.status === "canceled"
  const [expanded, setExpanded] = useState(!canceled)

  useEffect(() => {
    setExpanded(event.status !== "canceled")
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
    <Box px={3}>
      {canceled && (
        <Flex justifyContent="space-between">
          <Flex flexDirection="column">
            <Text color={fontColor} fontSize={1} mb={2} fontWeight="500">
              Return {event.status}
            </Text>
            <Text fontSize="11px" color={fontColor} mb={2}>
              {moment(event.time).format("MMMM Do YYYY, H:mm:ss")}
            </Text>
          </Flex>
          <Text
            color={fontColor}
            sx={{
              fontWeight: "500",
              // color: "#89959C",
              // ":hover": {
              //   color: "black",
              // },
              cursor: "pointer",
            }}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Hide" : "Show"}
          </Text>
        </Flex>
      )}
      {expanded && (
        <>
          {(event.no_notification || false) !==
            (order.no_notification || false) && (
            <Box mt={2} pr={2}>
              <Text color={fontColor}>
                Notifications related to this return are
                {event.no_notification ? " disabled" : " enabled"}.
              </Text>
            </Box>
          )}
          <Flex justifyContent="space-between">
            <Flex flexDirection="column">
              <Text color={fontColor} fontSize={1} mb={2} fontWeight="500">
                Return {event.status}
              </Text>
              <Text fontSize="11px" color={fontColor} mb={2}>
                {moment(event.time).format("MMMM Do YYYY, H:mm:ss")}
              </Text>
            </Flex>
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
          <Box mt={2}>
            <Flex justifyContent="space-between">
              <Box>
                {event.items.map(lineItem => (
                  <LineItem
                    fontColor={fontColor}
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
