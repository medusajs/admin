import moment from "moment"
import React, { useEffect, useState } from "react"
import { Box, Flex, Text } from "rebass"
import Button from "../../../../components/button"
import Dropdown from "../../../../components/dropdown"
import { getErrorMessage } from "../../../../utils/error-messages"
import LineItem from "../line-item"

export default ({
  event,
  order,
  onReceiveReturn,
  onCancelReturn,
  notification,
}) => {
  const fontColor = event.isLatest ? "medusa" : "inactive"

  const canceled = event.status === "canceled"
  const [expanded, setExpanded] = useState(!canceled)

  useEffect(() => {
    setExpanded(event.status !== "canceled")
  }, [event])

  const cancelReturn = () => {
    return onCancelReturn(event.raw.id)
      .then()
      .catch((error) => notification("Error", getErrorMessage(error), "error"))
  }

  return (
    <Box px={3}>
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
        {canceled && (
          <Text
            color={fontColor}
            sx={{
              fontWeight: "500",
              cursor: "pointer",
            }}
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? "Hide" : "Show"}
          </Text>
        )}
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
      {expanded && (
        <Box mt={2}>
          <Flex justifyContent="space-between">
            <Box>
              {event.items.map((lineItem) => (
                <LineItem
                  fontColor={fontColor}
                  key={lineItem._id}
                  order={order}
                  lineItem={lineItem}
                />
              ))}
            </Box>
          </Flex>
        </Box>
      )}
    </Box>
  )
}
