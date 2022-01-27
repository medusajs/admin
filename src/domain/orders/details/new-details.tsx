import { navigate } from "gatsby"
import _ from "lodash"
import { useAdminOrder } from "medusa-react"
import React, { useEffect, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import ReactJson from "react-json-view"
import { Box, Flex, Text } from "rebass"
import { ReactComponent as ExternalLink } from "../../../assets/svg/external-link.svg"
import Avatar from "../../../components/atoms/avatar"
import Button from "../../../components/button"
import Dropdown from "../../../components/dropdown"
import CancelIcon from "../../../components/fundamentals/icons/cancel-icon"
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

const PaymentDetails = ({ order }) => {
  let manualRefund = 0
  let swapRefund = 0
  let returnRefund = 0

  let swapAmount = 0

  if (order?.refunds?.length) {
    order.refunds.forEach((ref) => {
      if (ref.reason === "other" || ref.reason === "discount") {
        manualRefund += ref.amount
      }
      if (ref.reason === "return") {
        returnRefund += ref.amount
      }
      if (ref.reason === "swap") {
        swapRefund += ref.amount
      }
    })
  }

  if (order?.swaps?.length) {
    swapAmount = _.sum(order.swaps.map((el) => el.difference_due))
  }

  return (
    <Flex>
      <Box flex={"0 20%"} pl={3} pr={5}>
        {!!swapAmount && (
          <Text pt={2} color="gray">
            Total for swaps
          </Text>
        )}
        {!!manualRefund && (
          <Text pt={2} color="gray">
            Refunded (manual)
          </Text>
        )}
        {!!returnRefund && (
          <Text pt={2} color="gray">
            Refunded (returns)
          </Text>
        )}
        <Text pt={2}>Net paid</Text>
      </Box>
      <Box px={3}>
        {!!swapAmount && (
          <Flex pt={2}>
            <AlignedDecimal currency={order.currency_code} value={swapAmount} />
          </Flex>
        )}
        {!!manualRefund && (
          <Flex pt={2}>
            <AlignedDecimal
              currency={order.currency_code}
              value={-manualRefund}
            />
          </Flex>
        )}
        {!!returnRefund && (
          <Flex pt={2}>
            <AlignedDecimal
              currency={order.currency_code}
              value={-returnRefund}
            />
          </Flex>
        )}
        <Flex pt={2}>
          <AlignedDecimal
            currency={order.currency_code}
            value={order.paid_total - order.refunded_total}
          />
        </Flex>
      </Box>
    </Flex>
  )
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

  const decidePaymentButton = (paymentStatus) => {
    const isSystemPayment = order?.payments?.some(
      (p) => p.provider_id === "system"
    )

    const shouldShowNotice =
      (paymentStatus === "awaiting" && isSystemPayment && !systemPaymentMenu) ||
      (paymentStatus === "requires_action" &&
        isSystemPayment &&
        !systemPaymentMenu)

    switch (true) {
      case paymentStatus === "captured" ||
        paymentStatus === "partially_refunded": {
        return {
          type: "primary",
          label: "Refund",
          onClick: () => setShowRefund(!showRefund),
        }
      }
      case shouldShowNotice: {
        return {
          label: "Capture",
          onClick: () => setSystemPaymentMenu(true),
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
              .catch((error) => {
                toaster(getErrorMessage(error), "error")
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

  const DisplayTotal = ({ totalAmount, totalTitle }) => (
    <div className="flex justify-between mt-4">
      <div className="inter-small-regular text-grey-90">{totalTitle}</div>
      <div className="flex">
        <div className="inter-small-regular text-grey-50 mr-3">
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
  )

  return (
    <div>
      <Breadcrumb
        currentPage={"Customer Details"}
        previousBreadcrumb={"Customers"}
        previousRoute="/a/customers"
      />
      <div className="flex space-x-4">
        <div className="flex flex-col w-2/3 h-full">
          <BodyCard
            className={"w-full mb-4 min-h-[200px]"}
            title="Order #2414"
            subtitle="29 January 2022, 23:01"
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
                {/* <div>{moment(customer?.created_at).format("DD MMM YYYY")}</div> */}
                <div>{"oli@medusajs.com"}</div>
              </div>
              <div className="flex flex-col pl-6">
                <div className="inter-smaller-regular text-grey-50 mb-1">
                  Phone
                </div>
                <div>{"+45 27 82 62 03"}</div>
              </div>
              <div className="flex flex-col pl-6">
                <div className="inter-smaller-regular text-grey-50 mb-1">
                  Payment
                </div>
                <div>{"Stripe"}</div>
              </div>
            </div>
          </BodyCard>
          <BodyCard className={"w-full mb-4 min-h-0 h-auto"} title="Summary">
            <div className="mt-6">
              {newOrder?.items?.map((item, i) => (
                <div className="flex justify-between">
                  <div className="flex">
                    <div className="h-[48px] w-[35px] mr-4">
                      <img src={item.thumbnail} className="rounded-rounded" />
                    </div>
                    <div className="flex flex-col w-full">
                      <span className="inter-small-regular text-grey-90">
                        {item.title}
                      </span>
                      <span className="inter-small-regular text-grey-50">
                        {item.variant.sku}
                      </span>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="flex space-x-6 mr-3">
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
              <DisplayTotal
                totalAmount={newOrder?.shipping_total}
                totalTitle={"Shipping"}
              />
              <DisplayTotal
                totalAmount={newOrder?.tax_total}
                totalTitle={`Tax @ ${newOrder?.tax_rate}%`}
              />

              <div className="flex justify-between mt-4">
                <div className="inter-small-regular text-grey-90">Total</div>
                <div className="inter-xlarge-semibold text-grey-90">
                  {formatAmountWithSymbol({
                    amount: newOrder?.subtotal,
                    currency: newOrder?.currency_code || "",
                    digits: 2,
                    tax: newOrder?.tax_rate,
                  })}
                </div>
              </div>
            </div>
          </BodyCard>
          <BodyCard className={"w-full mb-4 min-h-0 h-auto"} title="Payment">
            <div className="mt-6">
              {newOrder?.payments.map((payment) => (
                <DisplayTotal
                  totalAmount={payment?.amount}
                  totalTitle={payment.id}
                />
              ))}
              <div className="flex justify-between mt-4">
                <div className="inter-small-semibold text-grey-90">
                  Total Paid
                </div>
                <div className="flex">
                  <div className="inter-small-regular text-grey-90 mr-3">
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
          <BodyCard className={"w-full mb-4 min-h-0 h-auto"} title="Customer">
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
                  <div>{newOrder?.email}</div>
                </div>
                <div className="flex flex-col pl-6">
                  <div className="inter-small-regular text-grey-50 mb-1">
                    Shipping
                  </div>
                  <div className="flex flex-col pl-6">
                    <span>
                      {newOrder?.shipping_address.address_1}{" "}
                      {newOrder?.shipping_address.address_2}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col pl-6">
                  <div className="inter-small-regular text-grey-50 mb-1">
                    Shipping
                  </div>
                  <div className="flex flex-col pl-6">
                    <span>
                      {newOrder?.billing_address.address_1}{" "}
                      {newOrder?.billing_address.address_2}
                    </span>
                  </div>
                </div>
              </div>
            </div>
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
