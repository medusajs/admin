import React from "react"
import { Text, Flex, Box, Image } from "rebass"
import moment from "moment"

const SimpleEvent = ({ event, children }) => {
  const fontColor = event.isLatest ? "#454B54" : "grey"
  return (
    <Box key={event.id} sx={{ borderBottom: "hairline" }} pb={3} mb={3}>
      <Text ml={3} fontSize={1} color={fontColor} fontWeight="500" mb={2}>
        {event.event}
      </Text>
      <Text fontSize="11px" color={fontColor} ml={3} mb={2}>
        {moment(event.time).format("MMMM Do YYYY, H:mm:ss")}
      </Text>
      {children}
    </Box>
  )
}

export default SimpleEvent
