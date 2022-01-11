import React, { useState, useEffect } from "react"
import { Text, Flex, Box, Image } from "rebass"
import { navigate } from "gatsby"
import styled from "@emotion/styled"
import moment from "moment"

import { decideBadgeColor } from "../../../../utils/decide-badge-color"
import Typography from "../../../../components/typography"
import Badge from "../../../../components/fundamentals/badge"
import Button from "../../../../components/button"
import Dropdown from "../../../../components/dropdown"
import LineItem from "../line-item"
import useMedusa from "../../../../hooks/use-medusa"

import ClaimEdit from "./edit"

export default ({
  event,
  order,
  onSaveClaim,
  onFulfillClaim,
  onReceiveReturn,
  onCancelClaim,
}) => {
  const fontColor = event.isLatest ? "medusa" : "inactive"

  const { toaster } = useMedusa("store")
  const [showEditClaim, setShowEditClaim] = useState(false)

  const canceled = event.raw.canceled_at !== null
  const [expanded, setExpanded] = useState(!canceled)

  useEffect(() => {
    setExpanded(event.raw.canceled_at === null)
  }, [event])

  const payStatusColors = decideBadgeColor(event.raw.payment_status)
  const fulfillStatusColors = decideBadgeColor(event.raw.fulfillment_status)

  const actions = []

  if (event.raw.payment_status !== "refunded") {
    actions.push({
      label: "Cancel Claim",
      variant: "danger",
      onClick: () => {
        onCancelClaim(event.raw.id)
      },
    })
  }

  if (
    event.claim_type === "replace" &&
    (event.raw.fulfillment_status === "not_fulfilled" ||
      event.raw.fulfillment_status === "canceled")
  ) {
    actions.push({
      label: "Fulfill Claim",
      onClick: () => {
        onFulfillClaim(event.raw)
      },
    })
  }

  return (
    <Flex>
      <Box width={"100%"}>
        <Flex mb={2} px={3} width={"100%"} justifyContent="space-between">
          <Box>
            <Flex flexDirection="column">
              <Text mr={100} fontSize={1} color={fontColor} fontWeight="500">
                {canceled ? "Claim Canceled" : "Claim Created"}
              </Text>
              <Text fontSize="11px" color={fontColor}>
                {moment(event.time).format("MMMM Do YYYY, H:mm:ss")}
              </Text>
            </Flex>
            {expanded && (
              <>
                <Text fontSize="11px" color={fontColor}>
                  {(event.no_notification || false) !==
                    (order.no_notification || false) && (
                    <Box mt={2} pr={2}>
                      <Text color="gray">
                        Notifications related to this claim are
                        {event.no_notification ? " disabled" : " enabled"}.
                      </Text>
                    </Box>
                  )}
                </Text>
                {event.claim_type === "replace" ? (
                  <Flex mt={4}>
                    <Text mr={2} fontSize={1} color={fontColor}>
                      Fulfillment Status
                    </Text>
                    <Badge
                      color={fulfillStatusColors.color}
                      bg={fulfillStatusColors.bgColor}
                    >
                      {event.raw.fulfillment_status}
                    </Badge>
                  </Flex>
                ) : (
                  <Flex mt={4}>
                    <Text mr={2} fontSize={1} color={fontColor}>
                      Payment Status
                    </Text>
                    <Badge
                      color={payStatusColors.color}
                      bg={payStatusColors.bgColor}
                    >
                      {event.raw.payment_status}
                    </Badge>
                  </Flex>
                )}
              </>
            )}
          </Box>

          <Box>
            {actions.length > 0 && !canceled && (
              <Flex>
                <Box mr={2}>
                  {!canceled && (
                    <Button
                      onClick={() => setShowEditClaim(true)}
                      variant="primary"
                    >
                      Edit
                    </Button>
                  )}
                </Box>

                <Dropdown>
                  {actions.map(o => (
                    <Text color={o.variant} onClick={o.onClick}>
                      {o.label}
                    </Text>
                  ))}
                </Dropdown>
              </Flex>
            )}
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
          </Box>
        </Flex>
        {expanded && (
          <>
            <Flex mx={3} justifyContent="space-between" alignItems="center">
              <Box>
                <Flex mb={2}>
                  <Text color={fontColor} mr={2}>
                    Claimed items
                  </Text>
                </Flex>
                {event.claim_items.map((lineItem, i) => (
                  <LineItem
                    fontColor={fontColor}
                    key={lineItem.id}
                    order={order}
                    lineItem={lineItem}
                  />
                ))}
              </Box>
            </Flex>
            {event.claim_type === "replace" ? (
              <Flex mx={3} justifyContent="space-between" alignItems="center">
                <Box>
                  <Flex mt={3} mb={2}>
                    <Text color={fontColor} mr={2}>
                      New items
                    </Text>
                  </Flex>
                  {event.items.map((lineItem, i) => (
                    <LineItem
                      fontColor={fontColor}
                      key={lineItem.id}
                      order={order}
                      lineItem={lineItem}
                    />
                  ))}
                </Box>
              </Flex>
            ) : (
              <Flex mx={3} justifyContent="space-between" alignItems="center">
                <Box color={fontColor}>
                  <Flex mt={3} mb={2}>
                    <Text color={fontColor} mr={2}>
                      Amount refunded
                    </Text>
                  </Flex>
                  {event.raw.refund_amount / 100}{" "}
                  {order.currency_code.toUpperCase()}
                </Box>
              </Flex>
            )}
          </>
        )}
      </Box>
      {showEditClaim && (
        <ClaimEdit
          toaster={toaster}
          claim={event.raw}
          order={order}
          onSave={onSaveClaim}
          onDismiss={() => setShowEditClaim(false)}
        />
      )}
    </Flex>
  )
}
