import React, { useEffect, useState, useMemo } from "react"
import { Text, Flex, Box, Image } from "rebass"
import { navigate } from "gatsby"
import styled from "@emotion/styled"
import moment from "moment"
import ReactTooltip from "react-tooltip"

import { ReactComponent as Clipboard } from "../../../../assets/svg/clipboard.svg"
import { decideBadgeColor } from "../../../../utils/decide-badge-color"
import Typography from "../../../../components/typography"
import Badge from "../../../../components/fundamentals/badge"
import LineItem from "../line-item"
import Dropdown from "../../../../components/dropdown"
import useMedusa from "../../../../hooks/use-medusa"
import CopyToClipboard from "../../../../components/copy-to-clipboard"
import SwapDetails from "./swap-details/"
export default ({
  event,
  order,
  onProcessPayment,
  onFulfillSwap,
  onReceiveReturn,
  onCancelSwap,
  onCancelReturn,
}) => {
  const fontColor = event.isLatest ? "medusa" : "inactive"
  const { store, isLoading, toaster } = useMedusa("store")

  const payStatusColors = decideBadgeColor(event.raw.payment_status)
  const returnStatusColors =
    event.raw.return_order && event.raw.return_order.status
      ? decideBadgeColor(event.raw.return_order.status)
      : {
          bgColor: "#e3e8ee",
          color: "#4f566b",
        }
  const fulfillStatusColors = decideBadgeColor(event.raw.fulfillment_status)

  const actions = []

  const canceled = event.raw.canceled_at !== null
  const [expanded, setExpanded] = useState(!canceled)

  const paymentLink = useMemo(() => {
    if (!store || !store.payment_link_template) return ""

    return store.payment_link_template.replace(/\{cart_id\}/, event.raw.cart_id)
  }, [store])

  useEffect(() => {
    setExpanded(event.raw.canceled_at === null)
  }, [event])

  if (!canceled) {
    actions.push({
      label: "Cancel swap",
      variant: "danger",
      onClick: () => {
        onCancelSwap(event.raw)
      },
    })
  }

  if (
    event.raw.payment_status !== "captured" &&
    event.raw.payment_status !== "difference_refunded" &&
    !canceled &&
    event.raw.difference_due !== 0
  ) {
    actions.push({
      label:
        event.raw.difference_due > 0 ? "Capture Payment" : "Refund Difference",
      onClick: () => onProcessPayment(event.raw.id),
    })
  }

  if (
    (event.raw.fulfillment_status === "not_fulfilled" ||
      event.raw.fulfillment_status === "canceled") &&
    !canceled
  ) {
    actions.push({
      label: "Fulfill Swap",
      onClick: () => {
        onFulfillSwap(event.raw)
      },
    })
  }

  if (
    (event.raw.return_order.status === "requested" ||
      event.raw.return_order.status === "canceled") &&
    !canceled
  ) {
    actions.push({
      label: "Receive Return",
      onClick: () =>
        onReceiveReturn({
          ...event.raw.return_order,
          swap_id: event.raw.id,
          is_swap: true,
        }),
    })
  }

  return (
    <Flex>
      <Box width={"100%"}>
        <Flex mb={1} px={3} width={"100%"} justifyContent="space-between">
          <Flex alignItems="flex-start">
            <Flex mb={2}>
              <Flex flexDirection="column">
                <Text
                  mr={100}
                  fontSize={1}
                  mb={2}
                  color={fontColor}
                  fontWeight="500"
                >
                  {canceled ? "Swap Canceled" : "Swap Requested"}
                </Text>
                <Text fontSize="11px" color={fontColor}>
                  {moment(event.time).format("MMMM Do YYYY, H:mm:ss")}
                </Text>
              </Flex>
            </Flex>
            {expanded && (
              <>
                {(event.no_notification || false) !==
                  (order.no_notification || false) && (
                  <Box mt={2} pr={2}>
                    <Text color={fontColor}>
                      Notifications related to this swap are
                      {event.no_notification ? " disabled" : " enabled"}.
                    </Text>
                  </Box>
                )}
                <Flex alignItems="baseline">
                  <Flex mr={4} flexDirection="column">
                    <Flex alignItems="baseline">
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
                    {store?.payment_link_template &&
                      !canceled &&
                      event.raw.payment_status !== "captured" && (
                        <CopyToClipboard
                          label="Copy payment link"
                          tooltipText={paymentLink}
                          copyText={paymentLink}
                          fillColor={fontColor}
                        />
                      )}
                  </Flex>
                  <Text mr={2} fontSize={1} color={fontColor}>
                    Return Status
                  </Text>
                  <Badge
                    mr={4}
                    color={returnStatusColors.color}
                    bg={returnStatusColors.bgColor}
                  >
                    {event.raw.return_order.status}
                  </Badge>
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
              </>
            )}
          </Flex>
          <Flex>
            <SwapDetails
              event={event}
              order={order}
              paymentLink={paymentLink}
              onReceiveReturn={onReceiveReturn}
              onFulfillSwap={onFulfillSwap}
              swapId={event.raw.id}
              onProcessPayment={onProcessPayment}
            />
            {actions.length > 0 && (
              <Flex ml={2}>
                <Dropdown>
                  {actions.map(o => (
                    <Text color={o.variant} onClick={o.onClick}>
                      {o.label}
                    </Text>
                  ))}
                </Dropdown>
              </Flex>
            )}
          </Flex>
        </Flex>
        {expanded && (
          <>
            <Flex mx={3} justifyContent="space-between" alignItems="center">
              <Box>
                <Flex mb={2}>
                  <Text color={fontColor} mr={2}>
                    Return items
                  </Text>
                </Flex>
                {event.return_lines.map((lineItem, i) => (
                  <LineItem
                    fontColor={fontColor}
                    order={order}
                    key={lineItem.id}
                    lineItem={lineItem}
                  />
                ))}
              </Box>
            </Flex>
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
                    order={order}
                    key={lineItem.id}
                    lineItem={lineItem}
                  />
                ))}
              </Box>
            </Flex>
          </>
        )}
      </Box>
    </Flex>
  )
}
