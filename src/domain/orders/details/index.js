import React, { useCallback, useState } from "react"
import { Text, Flex, Box, Image } from "rebass"
import ReactJson from "react-json-view"
import styled from "@emotion/styled"
import { navigate } from "gatsby"
import moment from "moment"
import ReactTooltip from "react-tooltip"
import { useHotkeys } from "react-hotkeys-hook"

import ReturnMenu from "./returns"
import ReceiveMenu from "./returns/receive-menu"
import RefundMenu from "./refund"
import FulfillmentMenu from "./fulfillment"
import FulfillmentEdit from "./fulfillment/edit"
import Timeline from "./timeline"
import buildTimeline from "./utils/build-timeline"
import SwapMenu from "./swap/create"
import ClaimMenu from "./claim/create"
import CustomerInformation from "./customer"

import { ReactComponent as Clipboard } from "../../../assets/svg/clipboard.svg"
import Dialog from "../../../components/dialog"
import Card from "../../../components/card"
import Badge from "../../../components/badge"
import Button from "../../../components/button"
import Spinner from "../../../components/spinner"

import { decideBadgeColor } from "../../../utils/decide-badge-color"
import useMedusa from "../../../hooks/use-medusa"

const AlignedDecimal = ({ value, currency }) => {
  const fixed = (value / 100).toFixed(2)
  const [numPart, decimalPart] = fixed.split(".")

  return (
    <Flex>
      <Box flex={1} textAlign="right">
        {numPart}
      </Box>
      .<div>{decimalPart}</div>
      <Box ml={2}>{currency.toUpperCase()}</Box>
    </Flex>
  )
}

const Divider = props => (
  <Box
    {...props}
    as="hr"
    m={props.m}
    sx={{
      bg: "#e3e8ee",
      border: 0,
      height: 1,
    }}
  />
)

const gatherFulfillments = order => {
  const toReturn = []
  order.fulfillments.forEach((f, index) => {
    toReturn.push({
      title: `Fulfillment #${index + 1}`,
      type: "default",
      fulfillment: f,
    })
  })

  if (order.claims && order.claims.length) {
    order.claims.forEach(s => {
      if (s.fulfillment_status !== "not_fulfilled") {
        s.fulfillments.forEach((f, index) => {
          toReturn.push({
            title: `Claim Fulfillment #${index + 1}`,
            type: "claim",
            fulfillment: f,
            claim: s,
          })
        })
      }
    })
  }

  if (order.swaps && order.swaps.length) {
    order.swaps.forEach(s => {
      if (s.fulfillment_status !== "not_fulfilled") {
        s.fulfillments.forEach((f, index) => {
          toReturn.push({
            title: `Swap Fulfillment #${index + 1}`,
            type: "swap",
            fulfillment: f,
            swap: s,
          })
        })
      }
    })
  }

  return toReturn
}

const OrderDetails = ({ id }) => {
  const [swapToFulfill, setSwapToFulfill] = useState(false)
  const [claimToFulfill, setClaimToFulfill] = useState(false)
  const [showRefund, setShowRefund] = useState(false)
  const [showReturnMenu, setShowReturnMenu] = useState(false)
  const [showFulfillmentMenu, setShowFulfillmentMenu] = useState(false)
  const [updateFulfillment, setUpdateFulfillment] = useState(false)
  const [isHandlingOrder, setIsHandlingOrder] = useState(false)
  const [captureLoading, setCaptureLoading] = useState(false)
  const [showCancelDialog, setCancelDialog] = useState(false)
  const [showSwap, setShowSwap] = useState(false)
  const [showClaim, setShowClaim] = useState(false)
  const [showEditCustomer, setShowEditCustomer] = useState(false)
  const [isCancelling, setCancelling] = useState(false)
  const [toReceive, setToReceive] = useState(false)
  const [isFulfilling, setIsFulfilling] = useState(false)

  const {
    order,
    update: updateOrder,
    capturePayment,
    requestReturn,
    receiveReturn,
    receiveSwap,
    receiveClaim,
    createFulfillment,
    processSwapPayment,
    createShipment,
    createSwap,
    createClaim,
    createSwapShipment,
    fulfillSwap,
    fulfillClaim,
    createClaimShipment,
    refund,
    isLoading,
    updateClaim,
    archive,
    complete,
    cancel,
    toaster,
  } = useMedusa("orders", {
    id,
  })

  const handleCopyToClip = val => {
    var tempInput = document.createElement("input")
    tempInput.value = val
    document.body.appendChild(tempInput)
    tempInput.select()
    document.execCommand("copy")
    document.body.removeChild(tempInput)
    toaster("Copied!", "success")
  }

  useHotkeys("esc", () => navigate("/a/orders"))
  useHotkeys("command+i", () => handleCopyToClip(order.display_id), {}, [order])

  if (isLoading) {
    return (
      <Flex flexDirection="column" alignItems="center" height="100vh" mt="auto">
        <Box height="75px" width="75px" mt="50%">
          <Spinner dark />
        </Box>
      </Flex>
    )
  }

  const events = buildTimeline(order)

  const decidePaymentButton = paymentStatus => {
    switch (true) {
      case paymentStatus === "captured" ||
        paymentStatus === "partially_refunded": {
        return {
          type: "primary",
          label: "Refund",
          onClick: () => setShowRefund(!showRefund),
        }
      }
      case paymentStatus === "awaiting" ||
        paymentStatus === "requires_action": {
        return {
          label: "Capture",
          onClick: () => {
            setCaptureLoading(true)
            capturePayment()
              .then(() => {
                toaster("Succesfully captured payment", "success")
                setCaptureLoading(true)
              })
              .catch(() => {
                toaster("Failed to capture payment", "error")
                setCaptureLoading(true)
              })
          },
          isLoading: captureLoading,
        }
      }
      default:
        break
    }
  }

  let fulfillmentAction
  const canFulfill = order.items.some(
    item => item.fulfilled_quantity !== item.quantity
  )

  if (canFulfill && order.status !== "canceled") {
    fulfillmentAction = {
      type: "primary",
      label: "Create Fulfillment",
      onClick: () => setShowFulfillmentMenu(!showFulfillmentMenu),
    }
  }

  const orderDropdown = []
  if (order.payment_status === "awaiting") {
    orderDropdown.push({
      type: "danger",
      label: "Cancel order",
      onClick: () => {
        setCancelDialog(true)
      },
    })
  }

  let lineAction
  let lineDropdown = []
  if (order.status !== "canceled" && order.fulfillment_status !== "returned") {
    lineAction = {
      type: "primary",
      label: "Request return",
      onClick: () => setShowReturnMenu(!showReturnMenu),
    }

    lineDropdown.push({
      type: "primary",
      label: "Register swap",
      onClick: () => {
        setShowSwap(true)
      },
    })

    lineDropdown.push({
      type: "primary",
      label: "Register claim",
      onClick: () => {
        setShowClaim(true)
      },
    })
  }

  const fulfillments = gatherFulfillments(order)

  return (
    <Flex flexDirection="column" mb={5} py={5}>
      <Flex flexDirection="column" mb={2}>
        <Card mb={4}>
          <Card.Header
            dropdownOptions={orderDropdown}
            // action={
            //   order.status !== "archived" &&
            //   order.status !== "canceled" && {
            //     type: "",
            //     label: order.status === "completed" ? "Archive" : "Complete",
            //     onClick: () => {
            //       setIsHandlingOrder(true)
            //       if (order.status === "completed") {
            //         archive(order.id)
            //           .then(() =>
            //             toaster("Order successfully archived", "success")
            //           )
            //           .catch(() => toaster("Failed to archive order", "error"))
            //       } else if (order.status === "pending") {
            //         complete(order.id)
            //           .then(() =>
            //             toaster("Order successfully completed", "success")
            //           )
            //           .catch(() => toaster("Failed to complete order", "error"))
            //       }
            //       setIsHandlingOrder(false)
            //     },
            //     isLoading: isHandlingOrder,
            //   }
            // }
          >
            <Flex alignItems="center">
              <Flex
                onClick={() => handleCopyToClip(order.display_id)}
                sx={{
                  cursor: "pointer",
                }}
                data-for={"order-display_id"}
                data-tip={"Click to copy"}
              >
                <ReactTooltip
                  id={"order-display_id"}
                  place="top"
                  effect="solid"
                />
                <Box>#{order.display_id}</Box>
                <Box ml={1}>
                  <Clipboard
                    style={{
                      ":hover": {
                        fill: "#454545",
                      },
                    }}
                    fill={"#848484"}
                    width="8"
                    height="8"
                  />
                </Box>
              </Flex>
              {/* <Badge
                ml={3}
                color={decideBadgeColor(order.status).color}
                bg={decideBadgeColor(order.status).bgColor}
              >
                {order.status}
              </Badge> */}
            </Flex>
          </Card.Header>
          <Box>
            <Text p={3} fontWeight="bold">
              {(order.total / 100).toFixed(2)}{" "}
              {order.currency_code.toUpperCase()}
            </Text>
          </Box>
          <Card.Body>
            <Box pl={3} pr={2}>
              <Text pb={1} color="gray">
                Date
              </Text>
              <Text>
                {moment(order.created).format("MMMM Do YYYY, h:mm:ss")}
              </Text>
            </Box>
            <Card.VerticalDivider mx={3} />
            <Box pl={3} pr={2}>
              <Text pb={1} color="gray">
                Email
              </Text>
              <Text>{order.email}</Text>
            </Box>
            <Card.VerticalDivider mx={3} />
            <Box pl={3} pr={2}>
              <Text pb={1} color="gray">
                Phone
              </Text>
              <Text>
                {order.shipping_address.phone
                  ? order.shipping_address.phone
                  : "N / A"}
              </Text>
            </Box>
            <Card.VerticalDivider mx={3} />
            <Box pl={3} pr={2}>
              <Text pb={1} color="gray">
                Payment
              </Text>
              <Text>
                {order.payments
                  .map(({ provider_id }) => provider_id)
                  .join(", ")}
              </Text>
            </Box>
          </Card.Body>
        </Card>
      </Flex>
      {/* Line items */}
      <Card mb={4}>
        <Card.Header dropdownOptions={lineDropdown} action={lineAction}>
          Timeline
        </Card.Header>
        <Card.Body flexDirection="column">
          <Timeline
            events={events}
            order={order}
            onSaveClaim={updateClaim}
            onFulfillClaim={claim => setClaimToFulfill(claim)}
            onReceiveClaim={receiveClaim}
            onProcessSwapPayment={processSwapPayment}
            onFulfillSwap={swap => setSwapToFulfill(swap)}
            onReceiveReturn={ret => setToReceive(ret)}
          />
        </Card.Body>
      </Card>
      {/* PAYMENT */}
      <Card mb={4}>
        <Card.Header
          badge={{
            label: order.payment_status,
            color: decideBadgeColor(order.payment_status).color,
            bgColor: decideBadgeColor(order.payment_status).bgColor,
          }}
          action={
            order.total !== order.refunded_total &&
            decidePaymentButton(order.payment_status)
          }
        >
          Payment
        </Card.Header>
        <Card.Body flexDirection="column">
          <Flex>
            <Box flex={"0 20%"} pl={3} pr={5}>
              <Text color="gray">Subtotal</Text>
              <Text pt={1} color="gray">
                Shipping
              </Text>
              {order.discount_total > 0 && (
                <Text pt={1} color="gray">
                  Discount
                </Text>
              )}
              <Text pt={1} color="gray">
                Total
              </Text>
              <Text pt={1} color="gray" fontSize={0} fontStyle={"italic"}>
                Tax Amount
              </Text>
            </Box>
            <Box px={3}>
              <Text>
                <AlignedDecimal
                  currency={order.currency_code}
                  value={order.subtotal * (1 + order.tax_rate / 100)}
                />
              </Text>
              <Text pt={1}>
                <AlignedDecimal
                  currency={order.currency_code}
                  value={order.shipping_total * (1 + order.tax_rate / 100)}
                />
              </Text>
              {order.discount_total > 0 && (
                <Text pt={1}>
                  <AlignedDecimal
                    currency={order.currency_code}
                    value={-order.discount_total * (1 + order.tax_rate / 100)}
                  />
                </Text>
              )}
              <Text pt={1}>
                <AlignedDecimal
                  currency={order.currency_code}
                  value={order.total}
                />
              </Text>
              <Text pt={1} fontSize={0} fontStyle={"italic"}>
                <AlignedDecimal
                  currency={order.currency_code}
                  value={order.tax_total}
                />
              </Text>
            </Box>
          </Flex>
          <Divider mt={3} mb={1} />
          {(order.payment_status === "captured" ||
            order.payment_status === "refunded" ||
            order.payment_status === "partially_refunded") && (
            <Flex>
              <Box flex={"0 20%"} pl={3} pr={5}>
                <Text pt={2}>Amount paid</Text>
                {order.refunded_total > 0 && <Text pt={2}>Refunded</Text>}
              </Box>
              <Box px={3}>
                <Text pt={2}>
                  {order.refunded_total > 0 ? (
                    <Flex>
                      <strike style={{ marginRight: "10px" }}>
                        <AlignedDecimal
                          currency={order.currency_code}
                          value={order.total}
                        />
                      </strike>
                      <AlignedDecimal
                        currency={order.currency_code}
                        value={order.total - order.refunded_total}
                      />
                    </Flex>
                  ) : (
                    <AlignedDecimal
                      currency={order.currency_code}
                      value={order.total}
                    />
                  )}
                </Text>
                <Flex pt={2}>
                  {order.refunded_total > 0 && (
                    <AlignedDecimal
                      currency={order.currency_code}
                      value={order.refunded_total}
                    />
                  )}
                </Flex>
              </Box>
            </Flex>
          )}
        </Card.Body>
      </Card>
      {/* FULFILLMENT */}
      <Card mb={4}>
        <Card.Header
          action={fulfillmentAction}
          badge={{
            label: order.fulfillment_status,
            color: decideBadgeColor(order.fulfillment_status).color,
            bgColor: decideBadgeColor(order.fulfillment_status).bgColor,
          }}
        >
          Fulfillment
        </Card.Header>
        <Card.Body flexDirection="column">
          <Flex
            flexDirection="column"
            pb={3}
            sx={{
              borderBottom: "hairline",
            }}
          >
            {order.shipping_methods.map(method => (
              <Box key={method._id}>
                <Box pl={3} pr={2}>
                  <Text pb={1} color="gray">
                    Shipping Method
                  </Text>
                  <Text>{method.shipping_option.name}</Text>
                  <Text pt={3} pb={1} color="gray">
                    Data
                  </Text>
                  <ReactJson name={false} collapsed={true} src={method.data} />
                </Box>
                <Card.VerticalDivider mx={3} />
              </Box>
            ))}
          </Flex>
          <Flex width={1} flexDirection="column">
            {fulfillments.length > 0
              ? fulfillments.map(f => (
                  <Flex
                    key={f.fulfillment._id}
                    sx={{
                      ":not(:last-of-type)": {
                        borderBottom: "hairline",
                      },
                    }}
                    p={3}
                    alignItems="center"
                    justifyContent="space-between"
                  >
                    <Box>
                      <Text>
                        {f.title} Fulfilled by provider{" "}
                        {f.fulfillment.provider_id}
                      </Text>
                      {f.fulfillment.tracking_numbers.length > 0 ? (
                        <>
                          <Text my={1} color="gray">
                            Tracking Number
                          </Text>
                          <Text>
                            {f.fulfillment.tracking_numbers.join(", ")}
                          </Text>
                        </>
                      ) : (
                        <Text my={1} color="gray">
                          Not shipped
                        </Text>
                      )}
                    </Box>
                    {!f.fulfillment.shipped_at && order.status !== "canceled" && (
                      <Button
                        variant={"primary"}
                        onClick={() => setUpdateFulfillment(f)}
                      >
                        Mark Shipped
                      </Button>
                    )}
                  </Flex>
                ))
              : null}
          </Flex>
        </Card.Body>
      </Card>
      {/* CUSTOMER */}
      <CustomerInformation
        order={order}
        updateOrder={updateOrder}
        show={showEditCustomer}
        setShow={setShowEditCustomer}
        toaster={toaster}
      />
      {/* METADATA */}
      <Card mr={3} width="100%">
        <Card.Header>Raw order</Card.Header>
        <Card.Body>
          <ReactJson
            name={false}
            collapsed={true}
            src={order}
            style={{ marginLeft: "20px" }}
          />
        </Card.Body>
      </Card>
      {claimToFulfill && (
        <FulfillmentMenu
          type={"claim"}
          onFulfill={fulfillClaim}
          order={claimToFulfill}
          onDismiss={() => setClaimToFulfill(false)}
          toaster={toaster}
        />
      )}
      {swapToFulfill && (
        <FulfillmentMenu
          type={"claim"}
          onFulfill={fulfillSwap}
          order={swapToFulfill}
          onDismiss={() => setSwapToFulfill(false)}
          toaster={toaster}
        />
      )}
      {showFulfillmentMenu && (
        <FulfillmentMenu
          type={"default"}
          onFulfill={createFulfillment}
          order={order}
          onDismiss={() => setShowFulfillmentMenu(false)}
          toaster={toaster}
        />
      )}
      {showReturnMenu && (
        <ReturnMenu
          onReturn={requestReturn}
          order={order}
          onDismiss={() => setShowReturnMenu(false)}
          toaster={toaster}
        />
      )}
      {showRefund && (
        <RefundMenu
          onRefund={refund}
          order={order}
          onDismiss={() => setShowRefund(false)}
          toaster={toaster}
        />
      )}
      {updateFulfillment && (
        <FulfillmentEdit
          order={order}
          swap={updateFulfillment.swap}
          claim={updateFulfillment.claim}
          fulfillment={updateFulfillment.fulfillment}
          type={updateFulfillment.type}
          onCreateClaimShipment={createClaimShipment}
          onCreateSwapShipment={createSwapShipment}
          onCreateShipment={createShipment}
          onDismiss={() => setUpdateFulfillment(false)}
          toaster={toaster}
        />
      )}
      {toReceive && (
        <ReceiveMenu
          order={order}
          returnRequest={toReceive}
          onReceiveReturn={receiveReturn}
          onReceiveSwap={receiveSwap}
          onDismiss={() => setToReceive(false)}
          toaster={toaster}
        />
      )}
      {showClaim && (
        <ClaimMenu
          order={order}
          onCreate={createClaim}
          onDismiss={() => setShowClaim(false)}
          toaster={toaster}
        />
      )}
      {showSwap && (
        <SwapMenu
          order={order}
          onCreate={createSwap}
          onDismiss={() => setShowSwap(false)}
          toaster={toaster}
        />
      )}
      {showCancelDialog && (
        <Dialog
          title="Cancel order"
          submitText={"Cancel order"}
          cancelText={"Not now"}
          submitLoading={isCancelling}
          onSubmit={() => {
            setCancelling(true)
            cancel()
              .then(() => {
                toaster("Order was canceled", "success")
              })
              .catch(() => {
                toaster("Could not cancel order", "error")
              })
              .finally(() => {
                setCancelDialog(false)
                setCancelling(false)
              })
          }}
          onCancel={() => {
            setCancelDialog(false)
          }}
        >
          <Flex fontSize={2} flexDirection="column">
            <div>Are you sure you want to cancel?</div>
            This will unauthorize the payment and delete any cancellable
            fulfillments.
          </Flex>
        </Dialog>
      )}
    </Flex>
  )
}

export default OrderDetails
