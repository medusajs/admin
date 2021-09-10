import React, { useState } from "react"
import { Text, Flex, Box, Image } from "rebass"
import { navigate } from "gatsby"
import styled from "@emotion/styled"
import moment from "moment"
import ReactTooltip from "react-tooltip"

import { ReactComponent as Clipboard } from "../../../../assets/svg/clipboard.svg"
import { decideBadgeColor } from "../../../../utils/decide-badge-color"
import Typography from "../../../../components/typography"
import Badge from "../../../../components/badge"
import Button from "../../../../components/button"
import Dropdown from "../../../../components/dropdown"

export default ({ event, onResend }) => {
  const name = event_name => {
    switch (event_name) {
      case "order.placed":
        return "Order Confirmation"
      case "order.return_requested":
        return "Return Request Confirmation"
      case "order.shipment_created":
        return "Shipment Notice"
      case "order.items_returned":
        return "Return Received Notice"
      default:
        return event_name
    }
  }

  const handleResend = () => {
    onResend(event.raw)
  }

  return (
    <Flex
      alignItems="center"
      sx={{
        ".rsnd-btn": {
          display: "none",
        },
        ":hover": {
          ".rsnd-btn": {
            display: "inline-block",
          },
        },
      }}
    >
      <Box width={"100%"} sx={{ borderBottom: "hairline" }} mb={3} pb={3}>
        <Flex px={3} width={"100%"} justifyContent="space-between">
          <Box>
            <Flex mb={2}>
              <Text mr={100} fontSize={1} color="grey" fontWeight="500">
                {name(event.event_name)} Sent
              </Text>
            </Flex>
            <Text fontSize="11px" color="grey">
              {moment(event.time).format("MMMM Do YYYY, H:mm:ss")}
            </Text>
          </Box>
          <Button className="rsnd-btn" variant="primary" onClick={handleResend}>
            Resend
          </Button>
        </Flex>
      </Box>
    </Flex>
  )
}
