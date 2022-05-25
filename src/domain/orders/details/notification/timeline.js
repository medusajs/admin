import React from "react"
import { Text, Flex, Box } from "rebass"
import moment from "moment"
import Button from "../../../../components/button"

export default ({ event, onResend }) => {
  const fontColor = event.isLatest ? "medusa" : "inactive"
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
      <Box width={"100%"} pb={1}>
        <Flex px={3} width={"100%"} justifyContent="space-between">
          <Box>
            <Flex mb={2}>
              <Text mr={100} fontSize={1} color={fontColor} fontWeight="500">
                {name(event.event_name)} Sent
              </Text>
            </Flex>
            <Text fontSize="11px" color={fontColor}>
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
