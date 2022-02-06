import { Address, ClaimOrder, Fulfillment, Swap } from "@medusajs/medusa"
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
  useAdminRegion,
  useAdminUpdateOrder,
} from "medusa-react"
import moment from "moment"
import React, { useMemo, useState } from "react"
import { useHotkeys } from "react-hotkeys-hook"
import ReactJson from "react-json-view"
import Avatar from "../../../components/atoms/avatar"
import Spinner from "../../../components/atoms/spinner"
import Tooltip from "../../../components/atoms/tooltip"
import Badge from "../../../components/fundamentals/badge"
import Button from "../../../components/fundamentals/button"
import DetailsIcon from "../../../components/fundamentals/details-icon"
import CancelIcon from "../../../components/fundamentals/icons/cancel-icon"
import ClipboardCopyIcon from "../../../components/fundamentals/icons/clipboard-copy-icon"
import CornerDownRightIcon from "../../../components/fundamentals/icons/corner-down-right-icon"
import DollarSignIcon from "../../../components/fundamentals/icons/dollar-sign-icon"
import TruckIcon from "../../../components/fundamentals/icons/truck-icon"
import Breadcrumb from "../../../components/molecules/breadcrumb"
import BodyCard from "../../../components/organisms/body-card"
import DeletePrompt from "../../../components/organisms/delete-prompt"
import Timeline from "../../../components/organisms/timeline"
import useClipboard from "../../../hooks/use-clipboard"
import useToaster from "../../../hooks/use-toaster"
import { getErrorMessage } from "../../../utils/error-messages"
import { formatAmountWithSymbol } from "../../../utils/prices"
import AddressModal from "./address-modal"
import CreateFulfillmentModal from "./create-fulfillment"
import MarkShippedModal from "./mark-shipped"
import OrderLine from "./order-line"
import CreateRefundModal from "./refund"
import {
  DisplayTotal,
  FormattedAddress,
  FormattedFulfillment,
  FulfillmentStatusComponent,
  OrderStatusComponent,
  PaymentActionables,
  PaymentDetails,
  PaymentStatusComponent,
} from "./templates"

type OrderDetailFulfillment = {
  title: string
  type: string
  fulfillment: Fulfillment
  swap?: Swap
  claim?: ClaimOrder
}

const gatherAllFulfillments = (order) => {
  if (!order) {
    return []
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

const OrderDetails = ({ id }) => {
  const [deletePromptData, setDeletePromptData] = useState<DeletePromptData>(
    initDeleteState
  )
  const [addressModal, setAddressModal] = useState<null | {
    address: Address
    type: "billing" | "shipping"
  }>(null)

  const [showFulfillment, setShowFulfillment] = useState(false)
  const [showRefund, setShowRefund] = useState(false)
  const [fullfilmentToShip, setFullfilmentToShip] = useState(null)

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

  // @ts-ignore
  const { region } = useAdminRegion(order?.region_id, {
    enabled: !!order?.region_id,
  })

  const toaster = useToaster()

  const [, handleCopy] = useClipboard(order?.display_id, {
    successDuration: 5500,
    onCopied: () => toaster("Order ID copied", "success"),
  })

  const [, handleCopyEmail] = useClipboard(order?.email, {
    successDuration: 5500,
    onCopied: () => toaster("Email copied", "success"),
  })

  // @ts-ignore
  useHotkeys("esc", () => navigate("/a/orders"))
  useHotkeys("command+i", handleCopy)

  const {
    hasMovements,
    swapAmount,
    manualRefund,
    swapRefund,
    returnRefund,
  } = useMemo(() => {
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
    return {
      hasMovements: swapAmount + manualRefund + swapRefund + returnRefund !== 0,
      swapAmount,
      manualRefund,
      swapRefund,
      returnRefund,
    }
  }, [order])

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

  const allFulfillments = gatherAllFulfillments(order)

  const customerActionables = [
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
      label: "Go to Customer",
      icon: <DetailsIcon size={"20"} />,
      onClick: () => navigate(`/a/customers/${order.customer.id}`),
    },
  ]

  if (order?.billing_address) {
    customerActionables.push({
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
    })
  }

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
          <div className="flex flex-col w-7/12 h-full">
            <BodyCard
              className={"w-full mb-4 min-h-[200px]"}
              customHeader={
                <Tooltip side="top" content={"Copy ID"}>
                  <button
                    className="inter-xlarge-semibold text-grey-90 active:text-violet-90 cursor-pointer gap-x-2 flex items-center"
                    onClick={handleCopy}
                  >
                    #{order.display_id} <ClipboardCopyIcon size={16} />
                  </button>
                </Tooltip>
              }
              subtitle={moment(order.created_at).format("d MMMM YYYY hh:mm a")}
              status={<OrderStatusComponent status={order?.status} />}
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
                  <button
                    className="text-grey-90 active:text-violet-90 cursor-pointer gap-x-1 flex items-center"
                    onClick={handleCopyEmail}
                  >
                    {order?.email}
                    <ClipboardCopyIcon size={12} />
                  </button>
                </div>
                <div className="flex flex-col pl-6">
                  <div className="inter-smaller-regular text-grey-50 mb-1">
                    Phone
                  </div>
                  <div>{order?.shipping_address?.phone || "N/A"}</div>
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
                  <OrderLine key={i} item={item} region={order?.region} />
                ))}
                <DisplayTotal
                  currency={order?.currency_code}
                  totalAmount={order?.subtotal}
                  totalTitle={"Subtotal"}
                />
                {order?.discounts?.map((discount, index) => (
                  <DisplayTotal
                    currency={order?.currency_code}
                    totalAmount={-1 * order?.discount_total}
                    totalTitle={
                      <div className="flex inter-small-regular text-grey-90 items-center">
                        Discount:{" "}
                        <Badge className="ml-3" variant="default">
                          {discount.code}
                        </Badge>
                      </div>
                    }
                  />
                ))}
                <DisplayTotal
                  currency={order?.currency_code}
                  totalAmount={order?.shipping_total}
                  totalTitle={"Shipping"}
                />
                <DisplayTotal
                  currency={order?.currency_code}
                  totalAmount={order?.tax_total}
                  totalTitle={`Tax`}
                />
                <DisplayTotal
                  variant={"large"}
                  currency={order?.currency_code}
                  totalAmount={order?.total}
                  totalTitle={hasMovements ? "Original Total" : "Total"}
                />
                <PaymentDetails
                  manualRefund={manualRefund}
                  swapAmount={swapAmount}
                  swapRefund={swapRefund}
                  returnRefund={returnRefund}
                  paidTotal={order?.paid_total}
                  refundedTotal={order?.refunded_total}
                  currency={order?.currency_code}
                />
              </div>
            </BodyCard>
            <BodyCard
              className={"w-full mb-4 min-h-0 h-auto"}
              title="Payment"
              status={<PaymentStatusComponent status={order?.payment_status} />}
              customActionable={
                <PaymentActionables
                  order={order}
                  capturePayment={capturePayment}
                  showRefundMenu={() => setShowRefund(true)}
                />
              }
            >
              <div className="mt-6">
                {order?.payments.map((payment) => (
                  <div className="flex flex-col">
                    <DisplayTotal
                      currency={order?.currency_code}
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
                        amount: order?.paid_total - order?.refunded_total,
                        currency: order?.currency_code,
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
              status={
                <FulfillmentStatusComponent
                  status={order?.fulfillment_status}
                />
              }
              customActionable={
                order.fulfillment_status !== "fulfilled" &&
                order.status !== "canceled" &&
                order.fulfillment_status !== "shipped" && (
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => setShowFulfillment(true)}
                  >
                    Create Fulfillment
                  </Button>
                )
              }
            >
              <div className="mt-6">
                {order?.shipping_methods.map((method) => (
                  <div className="flex flex-col">
                    <span className="inter-small-regular text-grey-50">
                      Shipping Method
                    </span>
                    <span className="inter-small-regular text-grey-90 mt-2">
                      {method?.shipping_option?.name || ""}
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
                    <FormattedFulfillment
                      key={i}
                      order={order}
                      onCancelFulfillment={(data) =>
                        setDeletePromptData({
                          resource: "Fulfillment",
                          show: true,
                          onDelete: () => handleCancelFulfillment(data),
                        })
                      }
                      fulfillmentObj={fulfillmentObj}
                      setFullfilmentToShip={setFullfilmentToShip}
                    />
                  ))}
                </div>
              </div>
            </BodyCard>
            <BodyCard
              className={"w-full mb-4 min-h-0 h-auto"}
              title="Customer"
              actionables={customerActionables}
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
                  <FormattedAddress
                    title={"Shipping"}
                    addr={order?.shipping_address}
                  />
                  <FormattedAddress
                    title={"Billing"}
                    addr={order?.billing_address}
                  />
                </div>
              </div>
            </BodyCard>
            <BodyCard
              className={"w-full mb-4 min-h-0 h-auto"}
              title="Raw Order"
            >
              <div className="flex flex-col min-h-[100px] mt-4 bg-grey-5 px-3 py-2 h-full rounded-rounded">
                <span className="inter-base-semibold">
                  Data{" "}
                  <span className="text-grey-50 inter-base-regular">
                    (1 item)
                  </span>
                </span>
                <div className="flex flex-grow items-center mt-4">
                  <ReactJson name={false} collapsed={true} src={order} />
                </div>
              </div>
            </BodyCard>
          </div>
          <Timeline orderId={order.id} />
        </div>
      )}
      {addressModal && (
        <AddressModal
          handleClose={() => setAddressModal(null)}
          handleSave={(obj) => handleUpdateAddress(obj)}
          address={addressModal.address}
          type={addressModal.type}
          email={order?.email}
          allowedCountries={region?.countries}
        />
      )}
      {showFulfillment && order && (
        <CreateFulfillmentModal
          orderToFulfill={order as any}
          handleCancel={() => setShowFulfillment(false)}
          orderId={order.id}
        />
      )}
      {showRefund && order && (
        <CreateRefundModal
          order={order}
          onDismiss={() => setShowRefund(false)}
        />
      )}
      {fullfilmentToShip && order && (
        <MarkShippedModal
          orderToShip={order as any}
          handleCancel={() => setFullfilmentToShip(null)}
          fulfillment={fullfilmentToShip}
          orderId={order.id}
        />
      )}
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
