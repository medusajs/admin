import clsx from "clsx"
import { navigate } from "gatsby"
import { capitalize } from "lodash"
import { useAdminOrder } from "medusa-react"
import moment from "moment"
import React, { useEffect, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import ReactJson from "react-json-view"
import { Box, Flex, Text } from "rebass"
import { ReactComponent as ExternalLink } from "../../../assets/svg/external-link.svg"
import Avatar from "../../../components/atoms/avatar"
import Button from "../../../components/button"
import Dropdown from "../../../components/dropdown"
import Badge from "../../../components/fundamentals/badge"
import CancelIcon from "../../../components/fundamentals/icons/cancel-icon"
import CornerDownRightIcon from "../../../components/fundamentals/icons/corner-down-right-icon"
import EditIcon from "../../../components/fundamentals/icons/edit-icon"
import StatusDot from "../../../components/fundamentals/status-indicator"
import Breadcrumb from "../../../components/molecules/breadcrumb"
import BodyCard from "../../../components/organisms/body-card"
import Spinner from "../../../components/spinner"
import useMedusa from "../../../hooks/use-medusa"
import Medusa from "../../../services/api"
import { getErrorMessage } from "../../../utils/error-messages"
import { formatAmountWithSymbol } from "../../../utils/prices"
import buildTimeline from "./utils/build-timeline"

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

const TrackingLink = ({ trackingLink }) => {
  if (trackingLink.url) {
    return (
      <a
        style={{ textDecoration: "none" }}
        target="_blank"
        href={trackingLink.url}
      >
        <Text
          sx={{
            fontWeight: "500",
            color: "link",
            svg: {
              stroke: "link",
              strokeWidth: "3",
            },
            ":hover": {
              color: "medusa",
              svg: {
                stroke: "medusa",
              },
            },
          }}
        >
          {trackingLink.tracking_number}
          <Box display="inline" ml={1}>
            <ExternalLink width="12" height="12" stroke="#5469D4" />
          </Box>
        </Text>
      </a>
    )
  } else {
    return <Text>{trackingLink.tracking_number}</Text>
  }
}

const Fulfillment = ({
  details,
  order,
  onUpdate,
  onCancelOrderFulfillment,
  onCancelClaimFulfillment,
  onCancelSwapFulfillment,
  toaster,
}) => {
  const { title, fulfillment } = details

  const canceled = fulfillment.canceled_at !== null

  const [expanded, setExpanded] = useState(!canceled)

  useEffect(() => {
    setExpanded(details.fulfillment.canceled_at === null)
  }, [details])

  const hasLinks =
    fulfillment?.shipped_at && !!fulfillment?.tracking_links?.length

  const cancelFulfillment = () => {
    let cancel = undefined
    switch (details.type) {
      case "claim":
        cancel = (id) =>
          onCancelClaimFulfillment(fulfillment.claim_order_id, id)
        break
      case "swap":
        cancel = (id) => onCancelSwapFulfillment(fulfillment.swap_id, id)
        break
      default:
        cancel = onCancelOrderFulfillment
        break
    }

    return cancel(fulfillment.id)
      .then()
      .catch((error) => {
        toaster(getErrorMessage(error), "error")
      })
  }

  return (
    <Flex
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
          {canceled
            ? `${title} has been canceled`
            : `${title} Fulfilled by provider ${fulfillment.provider_id}`}
        </Text>

        {expanded && (
          <>
            {(fulfillment.no_notification || false) !==
              (order.no_notification || false) && (
              <Box mt={2} pr={2}>
                <Text color="gray">
                  Notifications related to this fulfillment are
                  {fulfillment.no_notification ? " disabled" : " enabled"}.
                </Text>
              </Box>
            )}{" "}
            {!fulfillment.shipped_at ? (
              <Text my={1} color="gray">
                Not shipped
              </Text>
            ) : (
              <Text mt={1} color="grey">
                Tracking
              </Text>
            )}
            {hasLinks
              ? fulfillment.tracking_links.map((tl) => (
                  <TrackingLink trackingLink={tl} />
                ))
              : fulfillment.tracking_numbers.length > 0 && (
                  <Text>{fulfillment.tracking_numbers.join(", ")}</Text>
                )}
          </>
        )}
      </Box>
      {!canceled ? (
        !fulfillment.shipped_at && (
          <Flex>
            <Button
              mr={3}
              variant={"primary"}
              onClick={() => onUpdate(details)}
            >
              Mark Shipped
            </Button>
            <Dropdown>
              <Text color="danger" onClick={cancelFulfillment}>
                Cancel fulfillment
              </Text>
            </Dropdown>
          </Flex>
        )
      ) : (
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
  )
}

const Divider = (props) => (
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

const gatherFulfillments = (order) => {
  const toReturn = []
  order.fulfillments.forEach((f, index) => {
    toReturn.push({
      title: `Fulfillment #${index + 1}`,
      type: "default",
      fulfillment: f,
    })
  })

  if (order.claims && order.claims.length) {
    order.claims.forEach((s) => {
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
    order.swaps.forEach((s) => {
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
  const [systemPaymentMenu, setSystemPaymentMenu] = useState(false)

  const [notifications, setNotifications] = useState([])
  const [notificationsLoaded, setNotificationsLoaded] = useState(false)
  const [notificationResend, setNotificationResend] = useState(false)

  const [notes, setNotes] = useState([])
  const [notesLoaded, setNotesLoaded] = useState(false)
  const [note, setNote] = useState("")

  const [showAddNote, setShowAddNote] = useState(false)

  const {
    order,
    update: updateOrder,
    capturePayment,
    requestReturn,
    receiveReturn,
    cancelReturn,
    receiveClaim,
    createFulfillment,
    cancelFulfillment,
    processSwapPayment,
    createShipment,
    createSwap,
    cancelSwap,
    createClaim,
    cancelClaim,
    createSwapShipment,
    fulfillSwap,
    cancelSwapFulfillment,
    fulfillClaim,
    cancelClaimFulfillment,
    createClaimShipment,
    refund,
    isLoading,
    updateClaim,
    cancel,
    toaster,
  } = useMedusa("orders", {
    id,
  })

  const { order: newOrder } = useAdminOrder(id)

  useEffect(() => {
    if (order?.id && !notificationsLoaded) {
      Medusa.notifications
        .list({
          resource_type: "order",
          resource_id: order.id,
        })
        .then(({ data }) => {
          setNotifications(data.notifications)
        })
        .finally(() => setNotificationsLoaded(true))
    }

    if (order?.id && !notesLoaded) {
      Medusa.notes
        .listByResource(order.id)
        .then(({ data }) => {
          setNotes(data.notes)
        })
        .finally(() => setNotesLoaded(true))
    }
  }, [order])

  const handleCopyToClip = (val) => {
    const tempInput = document.createElement("input")
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

  const events = buildTimeline(order, notifications, notes)

  const createNote = () => {
    Medusa.notes
      .create(order.id, "order", note)
      .then(() => {
        Medusa.notes.listByResource(order.id).then((response) => {
          setNotes(response.data.notes)
        })
      })
      .then(() => {
        toaster("created note", "success")
        setNote("")
        setShowAddNote(false)
      })
  }

  const handleEnterNote = (event) => {
    if (event.key === "Enter") {
      createNote()
    }
  }

  const handleCancelNote = () => {
    setNote("")
    setShowAddNote(false)
  }

  const getFulfillmentStatus = () => {
    let allItems = [...order.items]

    if (order.swaps && order.swaps.length) {
      for (const s of order.swaps) {
        allItems = [...allItems, ...s.additional_items]
      }
    }

    let fulfillmentStatus = order.fulfillment_status

    if (fulfillmentStatus === "requires_action") {
      return fulfillmentStatus
    }

    if (
      allItems.every(
        (item) => item.returned_quantity === item.fulfilled_quantity
      ) &&
      fulfillmentStatus !== "not_fulfilled" &&
      fulfillmentStatus !== "fulfilled" &&
      fulfillmentStatus !== "shipped"
    ) {
      fulfillmentStatus = "returned"
    }

    if (
      allItems.find((item) => !item.returned_quantity) &&
      allItems.find((item) => item.returned_quantity)
    ) {
      fulfillmentStatus = "partially_returned"
    }

    return fulfillmentStatus
  }

  let fulfillmentAction
  const canFulfill = order.items.some(
    (item) => item.fulfilled_quantity !== item.quantity
  )

  if (canFulfill && order.status !== "canceled") {
    fulfillmentAction = {
      type: "primary",
      label: "Create Fulfillment",
      onClick: () => setShowFulfillmentMenu(!showFulfillmentMenu),
    }
  }

  const orderDropdown = []
  if (order.status !== "canceled") {
    orderDropdown.push({
      variant: "danger",
      label: "Cancel order",
      onClick: () => {
        setCancelDialog(true)
      },
    })
  }

  let lineAction
  const lineDropdown = []
  if (
    order.status !== "canceled" &&
    getFulfillmentStatus() !== "returned" &&
    !showAddNote
  ) {
    lineDropdown.push({
      type: "primary",
      label: "Request return",
      onClick: () => setShowReturnMenu(!showReturnMenu),
    })

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

    lineDropdown.push({
      type: "primary",
      label: "Add note",
      onClick: () => {
        setShowAddNote(true)
      },
    })
  } else {
    lineAction = []

    lineAction.push({
      type: "primary",
      label: "Cancel",
      onClick: () => setShowAddNote(false),
    })

    lineAction.push({
      variant: "primary",
      label: "Save",
      onClick: () => {
        createNote()
      },
    })
  }
  const wrapCancel = (func) => {
    return (param) => {
      func(param)
        .then()
        .catch((error) => toaster(getErrorMessage(error), "error"))
    }
  }

  const fulfillments = gatherFulfillments(order)

  const DisplayTotal = ({
    totalAmount,
    totalTitle,
    subtitle = undefined,
    totalColor = "text-grey-90",
  }) => (
    <div className="flex justify-between mt-4 items-center">
      <div className="flex flex-col">
        <div className="inter-small-regular text-grey-90">{totalTitle}</div>
        {subtitle && (
          <div className="inter-small-regular text-grey-50 mt-1">
            {subtitle}
          </div>
        )}
      </div>
      <div className="flex">
        <div className={clsx(`inter-small-regular mr-3`, totalColor)}>
          {formatAmountWithSymbol({
            amount: totalAmount,
            currency: newOrder?.currency_code,
            digits: 2,
            tax: newOrder?.tax_rate,
          })}
        </div>
        <div className="inter-small-regular text-grey-50">
          {newOrder.currency_code.toUpperCase()}
        </div>
      </div>
    </div>
  )

  if (!newOrder) {
    return null
  }

  const OrderStatusComponent = () => {
    switch (newOrder?.status) {
      case "completed":
        return <StatusDot title="Published" variant="success" />
      case "pending":
        return <StatusDot title="Processing" variant="default" />
      case "canceled":
        return <StatusDot title="Proposed" variant="warning" />
      case "requires_action":
        return <StatusDot title="Rejected" variant="danger" />
      default:
        return null
    }
  }

  const PaymentStatusComponent = () => {
    switch (newOrder?.payment_status) {
      case "captured":
        return <StatusDot title="Paid" variant="success" />
      case "awaiting":
        return <StatusDot title="Awaiting" variant="default" />
      case "canceled":
        return <StatusDot title="Canceled" variant="danger" />
      case "requires_action":
        return <StatusDot title="Requires Action" variant="danger" />
      default:
        return null
    }
  }

  const FulfillmentStatusComponent = () => {
    switch (newOrder?.fulfillment_status) {
      case "shipped":
        return <StatusDot title="Shipped" variant="success" />
      case "fulfilled":
        return <StatusDot title="Fulfilled" variant="warning" />
      case "canceled":
        return <StatusDot title="Canceled" variant="danger" />
      case "partially_fulfilled":
        return <StatusDot title="Partially fulfilled" variant="warning" />
      case "requires_action":
        return <StatusDot title="Requires Action" variant="danger" />
      default:
        return null
    }
  }

  return (
    <div>
      <Breadcrumb
        currentPage={"Order Details"}
        previousBreadcrumb={"Orders"}
        previousRoute="/a/orders"
      />
      <div className="flex space-x-4">
        <div className="flex flex-col w-2/3 h-full">
          <BodyCard
            className={"w-full mb-4 min-h-[200px]"}
            title="Order #2414"
            subtitle="29 January 2022, 23:01"
            status={<OrderStatusComponent />}
            actionables={[
              {
                label: "Cancel Order",
                icon: <CancelIcon />,
                variant: "danger",
                onClick: () => console.log("Cancel order"),
              },
              {},
            ]}
          >
            <div className="flex mt-6 space-x-6 divide-x">
              <div className="flex flex-col">
                <div className="inter-smaller-regular text-grey-50 mb-1">
                  Email
                </div>
                <div>{newOrder?.email}</div>
              </div>
              <div className="flex flex-col pl-6">
                <div className="inter-smaller-regular text-grey-50 mb-1">
                  Phone
                </div>
                <div>{newOrder?.shipping_address?.phone || ""}</div>
              </div>
              <div className="flex flex-col pl-6">
                <div className="inter-smaller-regular text-grey-50 mb-1">
                  Payment
                </div>
                <div>
                  {newOrder?.payments
                    ?.map((p) => capitalize(p.provider_id))
                    .join(", ")}
                </div>
              </div>
            </div>
          </BodyCard>
          <BodyCard className={"w-full mb-4 min-h-0 h-auto"} title="Summary">
            <div className="mt-6">
              {newOrder?.items?.map((item, i) => (
                <div className="flex justify-between mb-1 h-[64px] py-2 hover:bg-grey-5 rounded-rounded">
                  <div className="flex space-x-4 justify-center">
                    <div className="flex h-[48px] w-[36px]">
                      <img
                        src={item.thumbnail}
                        className="rounded-rounded object-cover"
                      />
                    </div>
                    <div className="flex flex-col justify-center">
                      <span className="inter-small-regular text-grey-90 max-w-[225px] truncate">
                        {item.title}
                      </span>
                      <span className="inter-small-regular text-grey-50">
                        {item.variant.sku}
                      </span>
                    </div>
                  </div>
                  <div className="flex  items-center">
                    <div className="flex small:space-x-2 space-x-6 mr-3">
                      <div className="inter-small-regular text-grey-50">
                        {formatAmountWithSymbol({
                          amount: item.unit_price,
                          currency: newOrder.currency_code,
                          digits: 2,
                          tax: newOrder.tax_rate,
                        })}
                      </div>
                      <div className="inter-small-regular text-grey-50">
                        x {item.quantity}
                      </div>
                      <div className="inter-small-regular text-grey-90">
                        {formatAmountWithSymbol({
                          amount: item.unit_price * item.quantity,
                          currency: newOrder.currency_code,
                          digits: 2,
                          tax: newOrder.tax_rate,
                        })}
                      </div>
                    </div>
                    <div className="inter-small-regular text-grey-50">
                      {newOrder.currency_code.toUpperCase()}
                    </div>
                  </div>
                </div>
              ))}
              <DisplayTotal
                totalAmount={newOrder?.subtotal}
                totalTitle={"Subtotal"}
              />
              {newOrder.discounts?.map((discount, index) => (
                <div
                  key={index}
                  className="flex justify-between mt-4 items-center"
                >
                  <div className="flex inter-small-regular text-grey-90 items-center">
                    Discount:{" "}
                    <Badge className="ml-3" variant="denomination">
                      {discount.code}
                    </Badge>
                  </div>
                  <div className="inter-small-regular text-grey-90">
                    -
                    {formatAmountWithSymbol({
                      amount: newOrder?.total,
                      currency: newOrder?.currency_code || "",
                      digits: 2,
                      tax: newOrder?.tax_rate,
                    })}
                  </div>
                </div>
              ))}
              <DisplayTotal
                totalAmount={newOrder?.shipping_total}
                totalTitle={"Shipping"}
              />
              <DisplayTotal
                totalAmount={newOrder?.tax_total}
                totalTitle={`Tax`}
              />
              <div className="flex justify-between mt-4 items-center">
                <div className="inter-small-regular text-grey-90">Total</div>
                <div className="inter-xlarge-semibold text-grey-90">
                  {formatAmountWithSymbol({
                    amount: newOrder?.total,
                    currency: newOrder?.currency_code || "",
                    digits: 2,
                    tax: newOrder?.tax_rate,
                  })}
                </div>
              </div>
            </div>
          </BodyCard>
          <BodyCard
            className={"w-full mb-4 min-h-0 h-auto"}
            title="Payment"
            status={<PaymentStatusComponent />}
            actionables={[
              {
                label: "Capture Payment",
                variant: "normal",
                onClick: () => console.log("Capture order"),
              },
            ]}
          >
            <div className="mt-6">
              {newOrder?.payments.map((payment) => (
                <div className="flex flex-col">
                  <DisplayTotal
                    totalAmount={payment?.amount}
                    totalTitle={payment.id}
                    subtitle={`${moment(payment?.created_at).format(
                      "DD MMM YYYY hh:mm"
                    )}`}
                  />
                  {!!payment.amount && (
                    <div className="flex justify-between mt-4">
                      <div className="flex">
                        <div className="text-grey-40 mr-2">
                          <CornerDownRightIcon />
                        </div>
                        <div className="inter-small-regular text-grey-90">
                          Refunded
                        </div>
                      </div>
                      <div className="flex">
                        <div className="inter-small-regular text-grey-90 mr-3">
                          -
                          {formatAmountWithSymbol({
                            amount: newOrder?.total,
                            currency: newOrder?.currency_code,
                            digits: 2,
                            tax: newOrder?.tax_rate,
                          })}
                        </div>
                        <div className="inter-small-regular text-grey-50">
                          {newOrder.currency_code.toUpperCase()}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              <div className="flex justify-between mt-4">
                <div className="inter-small-semibold text-grey-90">
                  Total Paid
                </div>
                <div className="flex">
                  <div className="inter-small-semibold text-grey-90 mr-3">
                    {formatAmountWithSymbol({
                      amount: newOrder?.total,
                      currency: newOrder?.currency_code,
                      digits: 2,
                      tax: newOrder?.tax_rate,
                    })}
                  </div>
                  <div className="inter-small-regular text-grey-50">
                    {newOrder.currency_code.toUpperCase()}
                  </div>
                </div>
              </div>
            </div>
          </BodyCard>
          <BodyCard
            className={"w-full mb-4 min-h-0 h-auto"}
            title="Fulfillment"
            status={<FulfillmentStatusComponent />}
            actionables={[
              {
                label: "Create fulfillment",
                icon: <CancelIcon />,
                onClick: () => console.log("Create"),
              },
              {
                label: "Mark as shipped",
                icon: <CancelIcon />,
                onClick: () => console.log("Shipped"),
              },
              {
                label: "Cancel Fulfullment",
                icon: <CancelIcon />,
                variant: "danger",
                onClick: () => console.log("Cancel Fulfillment"),
              },
            ]}
          >
            <div className="mt-6">
              {newOrder?.shipping_methods.map((method) => (
                <div className="flex flex-col">
                  <span className="inter-small-regular text-grey-50">
                    Shipping Method
                  </span>
                  <span className="inter-small-regular text-grey-90 mt-2">
                    {method?.shipping_option.name || ""}
                  </span>
                  <div className="flex flex-col min-h-[100px] mt-8 bg-grey-5 px-3 py-2 h-full">
                    <span className="inter-base-semibold">
                      Data{" "}
                      <span className="text-grey-50 inter-base-regular">
                        (1 item)
                      </span>
                    </span>
                    <div className="flex flex-grow items-center mt-4">
                      <ReactJson
                        name={false}
                        collapsed={true}
                        src={method?.data}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </BodyCard>
          <BodyCard
            className={"w-full mb-4 min-h-0 h-auto"}
            title="Customer"
            actionables={[
              {
                label: "Edit Customer",
                icon: <EditIcon />,
                onClick: () => console.log("Edit Customer"),
              },
              {},
            ]}
          >
            <div className="mt-6">
              <div className="flex w-full space-x-4 items-center">
                <div className="flex w-[40px] h-[40px] ">
                  <Avatar
                    user={newOrder?.customer}
                    font="inter-large-semibold"
                    color="bg-fuschia-40"
                  />
                </div>
                <div>
                  <h1 className="inter-large-semibold text-grey-90">
                    {`${newOrder?.shipping_address.first_name} ${newOrder?.shipping_address.last_name}`}
                  </h1>
                  <span className="inter-small-regular text-grey-50">
                    {newOrder?.shipping_address.city},{" "}
                    {newOrder?.shipping_address.country_code}
                  </span>
                </div>
              </div>
              <div className="flex mt-6 space-x-6 divide-x">
                <div className="flex flex-col">
                  <div className="inter-small-regular text-grey-50 mb-1">
                    Contact
                  </div>
                  <div className="flex flex-col inter-small-regular">
                    <span>{newOrder?.email}</span>
                    <span>{newOrder?.shipping_address?.phone || ""}</span>
                  </div>
                </div>
                <div className="flex flex-col pl-6">
                  <div className="inter-small-regular text-grey-50 mb-1">
                    Shipping
                  </div>
                  <div className="flex flex-col inter-small-regular">
                    <span>
                      {newOrder?.shipping_address.address_1}{" "}
                      {newOrder?.shipping_address.address_2}
                    </span>
                    <span>
                      {newOrder?.shipping_address.city}
                      {", "}
                      {newOrder?.shipping_address?.province || ""}
                      {newOrder?.shipping_address?.postal_code}{" "}
                      {newOrder?.shipping_address?.country_code?.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col pl-6">
                  <div className="inter-small-regular text-grey-50 mb-1">
                    Billing
                  </div>
                  <div className="flex flex-col inter-small-regular">
                    {newOrder?.billing_address ? (
                      <>
                        <span>
                          {newOrder?.billing_address.address_1}{" "}
                          {newOrder?.billing_address.address_2}
                        </span>
                        <span>
                          {newOrder?.billing_address.city}
                          {", "}
                          {newOrder?.billing_address?.province || ""}
                          {newOrder?.billing_address?.postal_code}{" "}
                          {newOrder?.billing_address?.country_code?.toUpperCase()}
                        </span>
                      </>
                    ) : (
                      "No billing address"
                    )}
                  </div>
                </div>
              </div>
            </div>
          </BodyCard>
          <BodyCard className={"w-full mb-4 min-h-0 h-auto"} title="Raw Order">
            <ReactJson
              style={{ marginTop: "15px" }}
              name={false}
              collapsed={true}
              src={newOrder!}
            />
          </BodyCard>
        </div>
        <BodyCard title="Timeline" className="w-1/3">
          <div></div>
        </BodyCard>
      </div>
    </div>
  )
}

export default OrderDetails
