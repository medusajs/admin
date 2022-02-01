import { Address, ClaimOrder, Fulfillment, Swap } from "@medusajs/medusa"
import clsx from "clsx"
import { navigate } from "gatsby"
import { capitalize, sum } from "lodash"
import {
  useAdminCancelClaimFulfillment,
  useAdminCancelFulfillment,
  useAdminCancelOrder,
  useAdminCancelSwapFulfillment,
  useAdminCapturePayment,
  useAdminCreateClaimShipment,
  useAdminCreateShipment,
  useAdminCreateSwapShipment,
  useAdminOrder,
  useAdminUpdateOrder,
} from "medusa-react"
import moment from "moment"
import React, { useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import ReactJson from "react-json-view"
import Avatar from "../../../components/atoms/avatar"
import Spinner from "../../../components/atoms/spinner"
import Badge from "../../../components/fundamentals/badge"
import Button from "../../../components/fundamentals/button"
import DetailsIcon from "../../../components/fundamentals/details-icon"
import CancelIcon from "../../../components/fundamentals/icons/cancel-icon"
import CornerDownRightIcon from "../../../components/fundamentals/icons/corner-down-right-icon"
import DollarSignIcon from "../../../components/fundamentals/icons/dollar-sign-icon"
import PackageIcon from "../../../components/fundamentals/icons/package-icon"
import TruckIcon from "../../../components/fundamentals/icons/truck-icon"
import StatusDot from "../../../components/fundamentals/status-indicator"
import Actionables from "../../../components/molecules/actionables"
import Breadcrumb from "../../../components/molecules/breadcrumb"
import BodyCard from "../../../components/organisms/body-card"
import DeletePrompt from "../../../components/organisms/delete-prompt"
import useToaster from "../../../hooks/use-toaster"
import { getErrorMessage } from "../../../utils/error-messages"
import { formatAmountWithSymbol } from "../../../utils/prices"
import AddressModal from "./address-modal"
import CreateFulfillmentModal from "./create-fulfillment"

const gatherAllFulfillments = (order) => {
  if (!order) {
    return []
  }

  type OrderDetailFulfillment = {
    title: string
    type: string
    fulfillment: Fulfillment
    swap?: Swap
    claim?: ClaimOrder
  }

  const all: OrderDetailFulfillment[] = []

  order.fulfillments.forEach((f, index) => {
    all.push({
      title: `Fulfillment #${index + 1}`,
      type: "default",
      fulfillment: f,
    })
  })

  if (order.claims?.length) {
    order.claims.forEach((claim) => {
      if (claim.fulfillment_status !== "not_fulfilled") {
        claim.fulfillments.forEach((fulfillment, index) => {
          all.push({
            title: `Claim fulfillment #${index + 1}`,
            type: "claim",
            fulfillment,
            claim,
          })
        })
      }
    })
  }

  if (order.swaps?.length) {
    order.swaps.forEach((swap) => {
      if (swap.fulfillment_status !== "not_fulfilled") {
        swap.fulfillments.forEach((fulfillment, index) => {
          all.push({
            title: `Swap fulfillment #${index + 1}`,
            type: "swap",
            fulfillment,
            swap,
          })
        })
      }
    })
  }

  return all
}

const OrderDetails = ({ id }) => {
  type DeletePromptData = {
    resource: string
    onDelete: () => any
    show: boolean
  }

  const initDeleteState: DeletePromptData = {
    resource: "",
    onDelete: () => Promise.resolve(console.log("Delete resource")),
    show: false,
  }

  const [deletePromptData, setDeletePromptData] = useState<DeletePromptData>(
    initDeleteState
  )
  const [addressModal, setAddressModal] = useState<null | {
    address: Address
    type: "billing" | "shipping"
  }>(null)

  const [showFulfillment, setShowFulfillment] = useState(true)

  const { order, isLoading } = useAdminOrder(id)

  const markShipped = useAdminCreateShipment(id)
  const markClaimShipped = useAdminCreateClaimShipment(id)
  const markSwapShipped = useAdminCreateSwapShipment(id)
  const capturePayment = useAdminCapturePayment(id)
  const cancelOrder = useAdminCancelOrder(id)
  const updateOrder = useAdminUpdateOrder(id)
  const cancelFulfillment = useAdminCancelFulfillment(id)
  const cancelSwapFulfillment = useAdminCancelSwapFulfillment(id)
  const cancelClaimFulfillment = useAdminCancelClaimFulfillment(id)

  const toaster = useToaster()

  const handleCopyToClip = (val) => {
    const tempInput = document.createElement("input")
    tempInput.value = val
    document.body.appendChild(tempInput)
    tempInput.select()
    document.execCommand("copy")
    document.body.removeChild(tempInput)
  }

  // @ts-ignore
  useHotkeys("esc", () => navigate("/a/orders"))
  useHotkeys("command+i", () => handleCopyToClip(order?.display_id), {}, [
    order,
  ])

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
            currency: order?.currency_code,
            digits: 2,
            tax: order?.tax_rate,
          })}
        </div>
        <div className="inter-small-regular text-grey-50">
          {order?.currency_code.toUpperCase()}
        </div>
      </div>
    </div>
  )

  const Address = ({ title, addr }) => {
    if (!addr?.id) {
      return (
        <div className="flex flex-col pl-6">
          <div className="inter-small-regular text-grey-50 mb-1">{title}</div>
          <div className="flex flex-col inter-small-regular">N/A</div>
        </div>
      )
    }

    return (
      <div className="flex flex-col pl-6">
        <div className="inter-small-regular text-grey-50 mb-1">{title}</div>
        <div className="flex flex-col inter-small-regular">
          <span>
            {addr?.address_1} {addr?.address_2}
          </span>
          <span>
            {addr?.city}
            {", "}
            {addr?.province || ""}
            {addr?.postal_code} {addr?.country_code?.toUpperCase()}
          </span>
        </div>
      </div>
    )
  }

  const OrderStatusComponent = () => {
    switch (order?.status) {
      case "completed":
        return <StatusDot title="Completed" variant="success" />
      case "pending":
        return <StatusDot title="Processing" variant="default" />
      case "canceled":
        return <StatusDot title="Canceled" variant="danger" />
      case "requires_action":
        return <StatusDot title="Requires action" variant="danger" />
      default:
        return null
    }
  }

  const PaymentStatusComponent = () => {
    switch (order?.payment_status) {
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
    switch (order?.fulfillment_status) {
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

  const PaymentDetails = () => {
    let manualRefund = 0
    let swapRefund = 0
    let returnRefund = 0

    const swapAmount = sum(order?.swaps.map((s) => s.difference_due) || [0])

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

    return (
      <>
        {!!swapAmount && (
          <DisplayTotal
            totalAmount={swapAmount}
            totalTitle={"Total for Swaps"}
          />
        )}
        {!!swapRefund && (
          <DisplayTotal
            totalAmount={returnRefund}
            totalTitle={"Refunded for Swaps"}
          />
        )}
        {!!returnRefund && (
          <DisplayTotal
            totalAmount={returnRefund}
            totalTitle={"Refunded for Returns"}
          />
        )}
        {!!manualRefund && (
          <DisplayTotal
            totalAmount={manualRefund}
            totalTitle={"Manually refunded"}
          />
        )}
        <div className="flex justify-between mt-4 items-center">
          <div className="inter-base-semibold text-grey-90">Net Total</div>
          <div className="inter-xlarge-semibold text-grey-90">
            {formatAmountWithSymbol({
              amount: order!.paid_total - order!.refunded_total,
              currency: order?.currency_code || "",
              digits: 2,
              tax: order?.tax_rate,
            })}
          </div>
        </div>
      </>
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
          <div className="text-blue-60 ml-2">
            {trackingLink.tracking_number}{" "}
          </div>
        </a>
      )
    } else {
      return (
        <span className="text-blue-60 ml-2">
          {trackingLink.tracking_number}{" "}
        </span>
      )
    }
  }

  const PaymentActionables = () => {
    const isSystemPayment = order?.payments?.some(
      (p) => p.provider_id === "system"
    )

    const { payment_status } = order!

    // Default label and action
    let label = "Capture payment"
    let action = () => {
      capturePayment.mutate(void {}, {
        onSuccess: () => toaster("Successfully captured payment", "success"),
        onError: (err) => toaster(getErrorMessage(err), "error"),
      })
    }
    const loading = capturePayment.isLoading

    let shouldShowNotice = false
    // If payment is a system payment, we want to show a notice
    if (payment_status === "awaiting" && isSystemPayment) {
      shouldShowNotice = true
    }

    if (payment_status === "requires_action" && isSystemPayment) {
      shouldShowNotice = true
    }

    switch (true) {
      case payment_status === "captured" ||
        payment_status === "partially_refunded": {
        label = "Refund"
        action = () => console.log("TODO: Show refund menu")
        break
      }

      case shouldShowNotice: {
        action = () =>
          console.log(
            "TODO: Show alert indicating, that you are capturing a system payment"
          )
        break
      }

      case payment_status === "requires_action": {
        return null
      }
      default:
        break
    }

    return (
      <Button
        variant="secondary"
        size="small"
        onClick={action}
        loading={loading}
        className="min-w-[130px]"
      >
        {label}
      </Button>
    )
  }

  const handleDeleteOrder = async () => {
    return cancelOrder.mutate(void {}, {
      onSuccess: () => toaster("Successfully canceled order", "success"),
      onError: (err) => toaster(getErrorMessage(err), "error"),
    })
  }

  const handleUpdateAddress = async ({ data, type }) => {
    const { email, ...rest } = data

    const updateObj = {}

    if (type === "shipping") {
      updateObj["shipping_address"] = {
        ...rest,
      }
    } else {
      updateObj["billing_address"] = {
        ...rest,
      }
    }

    if (email) {
      updateObj["email"] = email
    }

    return updateOrder.mutate(updateObj, {
      onSuccess: () => {
        toaster("Successfully updated address", "success")
        setAddressModal(null)
      },
      onError: (err) => toaster(getErrorMessage(err), "error"),
    })
  }

  const handleCancelFulfillment = async ({
    resourceId,
    resourceType,
    fulId,
  }) => {
    switch (resourceType) {
      case "swap":
        return cancelSwapFulfillment.mutate(
          { swap_id: resourceId, fulfillment_id: fulId },
          {
            onSuccess: () => toaster("Successfully canceled order", "success"),
            onError: (err) => toaster(getErrorMessage(err), "error"),
          }
        )
      case "claim":
        return cancelClaimFulfillment.mutate(
          { claim_id: resourceId, fulfillment_id: fulId },
          {
            onSuccess: () => toaster("Successfully canceled order", "success"),
            onError: (err) => toaster(getErrorMessage(err), "error"),
          }
        )
      default:
        return cancelFulfillment.mutate(fulId, {
          onSuccess: () => toaster("Successfully canceled order", "success"),
          onError: (err) => toaster(getErrorMessage(err), "error"),
        })
    }
  }

  const handleCreateShipment = ({ resourceId, resourceType, fulfillment }) => {
    const tracking_numbers = fulfillment.tracking_numbers.map(
      ({ value }) => value
    )

    switch (resourceType) {
      case "swap":
        return markSwapShipped.mutate(
          {
            swap_id: resourceId,
            fulfillment_id: fulfillment.id,
            tracking_numbers,
          },
          {
            onSuccess: () => toaster("Swap marked as shipped", "success"),
            onError: (err) => toaster(getErrorMessage(err), "error"),
          }
        )

      case "claim":
        return markClaimShipped.mutate(
          {
            claim_id: resourceId,
            fulfillment_id: fulfillment.id,
            tracking_numbers,
          },
          {
            onSuccess: () => toaster("Claim marked as shipped", "success"),
            onError: (err) => toaster(getErrorMessage(err), "error"),
          }
        )

      default:
        return markShipped.mutate(
          {
            fulfillment_id: fulfillment.id,
            tracking_numbers,
          },
          {
            onSuccess: () => toaster("Order marked as shipped", "success"),
            onError: (err) => toaster(getErrorMessage(err), "error"),
          }
        )
    }
  }

  const FulFillment = ({ fulfillmentObj }) => {
    const { fulfillment } = fulfillmentObj
    const hasLinks = !!fulfillment.tracking_links?.length

    const getData = () => {
      switch (true) {
        case fulfillment?.claim_order_id:
          return {
            resourceId: fulfillment.claim_order_id,
            resourceType: "claim",
          }
        case fulfillment?.swap_id:
          return {
            resourceId: fulfillment.swap_id,
            resourceType: "swap",
          }
        default:
          return { resourceId: order?.id, resourceType: "order" }
      }
    }

    return (
      <div className="flex w-full justify-between">
        <div className="flex flex-col space-y-1 py-2">
          <div className="text-grey-90">
            {fulfillment.canceled_at
              ? "Fulfillment has been canceled"
              : `${fulfillmentObj.title} Fulfilled by ${capitalize(
                  fulfillment.provider_id
                )}`}
          </div>
          <div className="flex text-grey-50">
            {!fulfillment.shipped_at ? "Not shipped" : "Tracking"}
            {hasLinks &&
              fulfillment.tracking_links.map((tl, j) => (
                <TrackingLink key={j} trackingLink={tl} />
              ))}
          </div>
        </div>
        {!fulfillment.canceled_at && !fulfillment.shipped_at && (
          <div className="flex items-center space-x-2">
            <Actionables
              actions={[
                {
                  label: "Mark Shipped",
                  icon: <PackageIcon size={"20"} />,
                  onClick: () =>
                    handleCreateShipment({ ...getData(), fulfillment }),
                },
                {
                  label: "Cancel Fulfillment",
                  icon: <CancelIcon size={"20"} />,
                  onClick: () =>
                    setDeletePromptData({
                      resource: "Fulfillment",
                      show: true,
                      onDelete: () =>
                        handleCancelFulfillment({
                          ...getData(),
                          fulId: fulfillment.id,
                        }),
                    }),
                },
              ]}
            />
          </div>
        )}
      </div>
    )
  }

  const allFulfillments = gatherAllFulfillments(order)

  return (
    <div>
      <Breadcrumb
        currentPage={"Order Details"}
        previousBreadcrumb={"Orders"}
        previousRoute="/a/orders"
      />
      {isLoading || !order ? (
        <BodyCard className="w-full pt-2xlarge flex items-center justify-center">
          <Spinner size={"large"} variant={"secondary"} />
        </BodyCard>
      ) : (
        <div className="flex space-x-4">
          <div className="flex flex-col w-2/3 h-full">
            <BodyCard
              className={"w-full mb-4 min-h-[200px]"}
              title="Order #2414"
              subtitle="29 January 2022, 23:01"
              status={<OrderStatusComponent />}
              forceDropdown={true}
              actionables={[
                {
                  label: "Cancel Order",
                  icon: <CancelIcon size={"20"} />,
                  variant: "danger",
                  onClick: () =>
                    setDeletePromptData({
                      resource: "Order",
                      onDelete: () => handleDeleteOrder(),
                      show: true,
                    }),
                },
              ]}
            >
              <div className="flex mt-6 space-x-6 divide-x">
                <div className="flex flex-col">
                  <div className="inter-smaller-regular text-grey-50 mb-1">
                    Email
                  </div>
                  <div>{order?.email}</div>
                </div>
                <div className="flex flex-col pl-6">
                  <div className="inter-smaller-regular text-grey-50 mb-1">
                    Phone
                  </div>
                  <div>{order?.shipping_address?.phone || ""}</div>
                </div>
                <div className="flex flex-col pl-6">
                  <div className="inter-smaller-regular text-grey-50 mb-1">
                    Payment
                  </div>
                  <div>
                    {order?.payments
                      ?.map((p) => capitalize(p.provider_id))
                      .join(", ")}
                  </div>
                </div>
              </div>
            </BodyCard>
            <BodyCard className={"w-full mb-4 min-h-0 h-auto"} title="Summary">
              <div className="mt-6">
                {order?.items?.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between mb-1 h-[64px] py-2 mx-[-5px] px-[5px] hover:bg-grey-5 rounded-rounded"
                  >
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
                        {item?.variant && (
                          <span className="inter-small-regular text-grey-50">
                            {item.variant.sku}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex  items-center">
                      <div className="flex small:space-x-2 medium:space-x-4 large:space-x-6 mr-3">
                        <div className="inter-small-regular text-grey-50">
                          {formatAmountWithSymbol({
                            amount: item.unit_price,
                            currency: order?.currency_code,
                            digits: 2,
                            tax: order?.tax_rate,
                          })}
                        </div>
                        <div className="inter-small-regular text-grey-50">
                          x {item.quantity}
                        </div>
                        <div className="inter-small-regular text-grey-90">
                          {formatAmountWithSymbol({
                            amount: item.unit_price * item.quantity,
                            currency: order?.currency_code,
                            digits: 2,
                            tax: order?.tax_rate,
                          })}
                        </div>
                      </div>
                      <div className="inter-small-regular text-grey-50">
                        {order?.currency_code.toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))}
                <DisplayTotal
                  totalAmount={order?.subtotal}
                  totalTitle={"Subtotal"}
                />
                {order?.discounts?.map((discount, index) => (
                  <div
                    key={index}
                    className="flex justify-between mt-4 items-center"
                  >
                    <div className="flex inter-small-regular text-grey-90 items-center">
                      Discount:{" "}
                      <Badge className="ml-3" variant="default">
                        {discount.code}
                      </Badge>
                    </div>
                    <div className="inter-small-regular text-grey-90">
                      -
                      {formatAmountWithSymbol({
                        amount: order?.discount_total,
                        currency: order?.currency_code || "",
                        digits: 2,
                        tax: order?.tax_rate,
                      })}
                    </div>
                  </div>
                ))}
                <DisplayTotal
                  totalAmount={order?.shipping_total}
                  totalTitle={"Shipping"}
                />
                <DisplayTotal
                  totalAmount={order?.tax_total}
                  totalTitle={`Tax`}
                />
                <div className="flex justify-between mt-4 items-center">
                  <div className="inter-small-semibold text-grey-90">Total</div>
                  <div className="inter-small-semibold text-grey-90">
                    {formatAmountWithSymbol({
                      amount: order!.total,
                      currency: order?.currency_code || "",
                      digits: 2,
                      tax: order?.tax_rate,
                    })}
                  </div>
                </div>
                <PaymentDetails />
              </div>
            </BodyCard>
            <BodyCard
              className={"w-full mb-4 min-h-0 h-auto"}
              title="Payment"
              status={<PaymentStatusComponent />}
              customActionable={<PaymentActionables />}
            >
              <div className="mt-6">
                {order?.payments.map((payment) => (
                  <div className="flex flex-col">
                    <DisplayTotal
                      totalAmount={payment?.amount}
                      totalTitle={payment.id}
                      subtitle={`${moment(payment?.created_at).format(
                        "DD MMM YYYY hh:mm"
                      )}`}
                    />
                    {!!payment.amount_refunded && (
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
                              amount: payment?.amount_refunded,
                              currency: order?.currency_code,
                              digits: 2,
                              tax: order?.tax_rate,
                            })}
                          </div>
                          <div className="inter-small-regular text-grey-50">
                            {order?.currency_code.toUpperCase()}
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
                        amount: order?.total,
                        currency: order?.currency_code,
                        digits: 2,
                        tax: order?.tax_rate,
                      })}
                    </div>
                    <div className="inter-small-regular text-grey-50">
                      {order?.currency_code.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
            </BodyCard>
            <BodyCard
              className={"w-full mb-4 min-h-0 h-auto"}
              title="Fulfillment"
              status={<FulfillmentStatusComponent />}
              customActionable={
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => console.log("Create")}
                >
                  Create Fulfillment
                </Button>
              }
              actionables={[
                {
                  label: "Create fulfillment",
                  onClick: () => console.log("Create"),
                },
              ]}
            >
              <div className="mt-6">
                {order?.shipping_methods.map((method) => (
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
                <div className="mt-6 inter-small-regular ">
                  {allFulfillments.map((fulfillmentObj, i) => (
                    <FulFillment key={i} fulfillmentObj={fulfillmentObj} />
                  ))}
                </div>
              </div>
            </BodyCard>
            <BodyCard
              className={"w-full mb-4 min-h-0 h-auto"}
              title="Customer"
              actionables={[
                {
                  label: "Edit Shipping Address",
                  icon: <TruckIcon size={"20"} />,
                  onClick: () =>
                    setAddressModal({
                      address: order?.shipping_address,
                      type: "shipping",
                    }),
                },
                {
                  label: "Edit Billing Address",
                  icon: <DollarSignIcon size={"20"} />,
                  onClick: () => {
                    if (order.billing_address) {
                      setAddressModal({
                        address: order?.billing_address,
                        type: "billing",
                      })
                    }
                  },
                },
                {
                  label: "Go to Customer",
                  icon: <DetailsIcon size={"20"} />, // TODO: Change to Contact icon
                  onClick: () => navigate(`/a/customers/${order.customer.id}`),
                },
              ]}
            >
              <div className="mt-6">
                <div className="flex w-full space-x-4 items-center">
                  <div className="flex w-[40px] h-[40px] ">
                    <Avatar
                      user={order?.customer}
                      font="inter-large-semibold"
                      color="bg-fuschia-40"
                    />
                  </div>
                  <div>
                    <h1 className="inter-large-semibold text-grey-90">
                      {`${order?.shipping_address.first_name} ${order?.shipping_address.last_name}`}
                    </h1>
                    <span className="inter-small-regular text-grey-50">
                      {order?.shipping_address.city},{" "}
                      {order?.shipping_address.country_code}
                    </span>
                  </div>
                </div>
                <div className="flex mt-6 space-x-6 divide-x">
                  <div className="flex flex-col">
                    <div className="inter-small-regular text-grey-50 mb-1">
                      Contact
                    </div>
                    <div className="flex flex-col inter-small-regular">
                      <span>{order?.email}</span>
                      <span>{order?.shipping_address?.phone || ""}</span>
                    </div>
                  </div>
                  <Address title={"Shipping"} addr={order?.shipping_address} />
                  <Address title={"Billing"} addr={order?.billing_address} />
                </div>
              </div>
            </BodyCard>
            <BodyCard
              className={"w-full mb-4 min-h-0 h-auto"}
              title="Raw Order"
            >
              <ReactJson
                style={{ marginTop: "15px" }}
                name={false}
                collapsed={true}
                src={order!}
              />
            </BodyCard>
          </div>
          <BodyCard title="Timeline" className="w-1/3">
            <div></div>
          </BodyCard>
        </div>
      )}
      {addressModal && (
        <AddressModal
          handleClose={() => setAddressModal(null)}
          handleSave={(obj) => handleUpdateAddress(obj)}
          address={addressModal.address}
          type={addressModal.type}
          email={order?.email}
        />
      )}
      {showFulfillment && <CreateFulfillmentModal />}
      {/* An attempt to make a reusable delete prompt, so we don't have to hold +10
      state variables for showing different prompts */}
      {deletePromptData.show && (
        <DeletePrompt
          text={"Are you sure?"}
          heading={`Remove ${deletePromptData?.resource}`}
          successText={`${
            deletePromptData?.resource || "Resource"
          } has been removed`}
          onDelete={() => deletePromptData.onDelete()}
          handleClose={() => setDeletePromptData(initDeleteState)}
        />
      )}
    </div>
  )
}

export default OrderDetails
