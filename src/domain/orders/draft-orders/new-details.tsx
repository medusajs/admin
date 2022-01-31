import { Address } from "@medusajs/medusa"
import clsx from "clsx"
import { navigate } from "gatsby"
import {
  useAdminCancelOrder,
  useAdminDraftOrder,
  useAdminDraftOrderRegisterPayment,
  useAdminUpdateOrder,
} from "medusa-react"
import React, { useState } from "react"
import ReactJson from "react-json-view"
import Avatar from "../../../components/atoms/avatar"
import Spinner from "../../../components/atoms/spinner"
import Badge from "../../../components/fundamentals/badge"
import Button from "../../../components/fundamentals/button"
import DetailsIcon from "../../../components/fundamentals/details-icon"
// import CancelIcon from "../../../components/fundamentals/icons/cancel-icon"
import DollarSignIcon from "../../../components/fundamentals/icons/dollar-sign-icon"
import TruckIcon from "../../../components/fundamentals/icons/truck-icon"
import StatusDot from "../../../components/fundamentals/status-indicator"
import Breadcrumb from "../../../components/molecules/breadcrumb"
import BodyCard from "../../../components/organisms/body-card"
import DeletePrompt from "../../../components/organisms/delete-prompt"
import useToaster from "../../../hooks/use-toaster"
import { getErrorMessage } from "../../../utils/error-messages"
import { formatAmountWithSymbol } from "../../../utils/prices"

const DraftOrderDetails = ({ id }) => {
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

  const { draft_order, isLoading } = useAdminDraftOrder(id)

  const markPaid = useAdminDraftOrderRegisterPayment(id)
  const cancelOrder = useAdminCancelOrder(id)
  const updateOrder = useAdminUpdateOrder(id)

  const toaster = useToaster()

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
            currency: region.currency_code,
            digits: 2,
            tax: region.tax_rate,
          })}
        </div>
        <div className="inter-small-regular text-grey-50">
          {region.currency_code.toUpperCase()}
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
    switch (draft_order?.status) {
      case "completed":
        return <StatusDot title="Completed" variant="success" />
      case "open":
        return <StatusDot title="Open" variant="default" />
      default:
        return null
    }
  }

  const PaymentActionables = () => {
    // Default label and action
    const label = "Mark as paid"
    const action = () => {
      markPaid.mutate(void {}, {
        onSuccess: () => toaster("Successfully mark as paid", "success"),
        onError: (err) => toaster(getErrorMessage(err), "error"),
      })
    }

    return (
      <Button variant="secondary" size="small" onClick={action}>
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

  const { cart } = draft_order || {}
  const { region } = cart || {}

  return (
    <div>
      <Breadcrumb
        currentPage={"Order Details"}
        previousBreadcrumb={"Orders"}
        previousRoute="/a/orders"
      />
      {isLoading || !draft_order ? (
        <BodyCard className="w-full pt-2xlarge flex items-center justify-center">
          <Spinner size={"large"} variant={"secondary"} />
        </BodyCard>
      ) : (
        <div className="flex space-x-4">
          <div className="flex flex-col w-full h-full">
            <BodyCard
              className={"w-full mb-4 min-h-[200px]"}
              title="Order #2414"
              subtitle="29 January 2022, 23:01"
              status={<OrderStatusComponent />}
              forceDropdown={true}
              actionables={[
                {
                  label: "Cancel Draft Order",
                  icon: null,
                  // icon: <CancelIcon size={"20"} />,
                  variant: "danger",
                  onClick: () =>
                    setDeletePromptData({
                      resource: "Draft Order",
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
                  <div>{cart.email}</div>
                </div>
                <div className="flex flex-col pl-6">
                  <div className="inter-smaller-regular text-grey-50 mb-1">
                    Phone
                  </div>
                  <div>{cart.shipping_address?.phone || ""}</div>
                </div>
                <div className="flex flex-col pl-6">
                  <div className="inter-smaller-regular text-grey-50 mb-1">
                    Amount (DKK)
                  </div>
                  <div>
                    {formatAmountWithSymbol({
                      amount: cart.total,
                      currency: region.currency_code,
                    })}
                  </div>
                </div>
              </div>
            </BodyCard>
            <BodyCard className={"w-full mb-4 min-h-0 h-auto"} title="Summary">
              <div className="mt-6">
                {cart?.items?.map((item, i) => (
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
                            currency: region.currency_code,
                            digits: 2,
                            tax: region.tax_rate,
                          })}
                        </div>
                        <div className="inter-small-regular text-grey-50">
                          x {item.quantity}
                        </div>
                        <div className="inter-small-regular text-grey-90">
                          {formatAmountWithSymbol({
                            amount: item.unit_price * item.quantity,
                            currency: region.currency_code,
                            digits: 2,
                            tax: region.tax_rate,
                          })}
                        </div>
                      </div>
                      <div className="inter-small-regular text-grey-50">
                        {region.currency_code.toUpperCase()}
                      </div>
                    </div>
                  </div>
                ))}
                <DisplayTotal
                  totalAmount={draft_order?.cart.subtotal}
                  totalTitle={"Subtotal"}
                />
                {cart.discounts?.map((discount, index) => (
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
                        amount: cart.discount_total,
                        currency: region.currency_code || "",
                        digits: 2,
                        tax: region.tax_rate,
                      })}
                    </div>
                  </div>
                ))}
                <DisplayTotal
                  totalAmount={cart.shipping_total}
                  totalTitle={"Shipping"}
                />
                <DisplayTotal totalAmount={cart.tax_total} totalTitle={`Tax`} />
                <div className="flex justify-between mt-4 items-center">
                  <div className="inter-small-semibold text-grey-90">Total</div>
                  <div className="inter-xlarge-semibold text-grey-90">
                    {formatAmountWithSymbol({
                      amount: cart.total,
                      currency: region.currency_code || "",
                      digits: 2,
                      tax: region.tax_rate,
                    })}
                  </div>
                </div>
              </div>
            </BodyCard>
            <BodyCard
              className={"w-full mb-4 min-h-0 h-auto"}
              title="Payment"
              customActionable={<PaymentActionables />}
              // TODO: Actionables should not be required if customActionable is provided
              actionables={[
                {
                  onClick: () => console.log("Capture order"),
                  label: "Capture Payment",
                  icon: null,
                },
              ]}
            >
              <div className="mt-6">
                <DisplayTotal
                  totalAmount={draft_order?.cart.subtotal}
                  totalTitle={"Subtotal"}
                />
                <DisplayTotal
                  totalAmount={cart.shipping_total}
                  totalTitle={"Shipping"}
                />
                <DisplayTotal
                  totalAmount={cart?.tax_total}
                  totalTitle={"Tax"}
                />
                <div className="flex justify-between mt-4">
                  <div className="inter-small-semibold text-grey-90">
                    Total Paid
                  </div>
                  <div className="flex">
                    <div className="inter-small-semibold text-grey-90 mr-3">
                      {formatAmountWithSymbol({
                        amount: cart.total,
                        currency: region.currency_code,
                        digits: 2,
                        tax: region.tax_rate,
                      })}
                    </div>
                    <div className="inter-small-regular text-grey-50">
                      {region.currency_code.toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
            </BodyCard>
            <BodyCard className={"w-full mb-4 min-h-0 h-auto"} title="Shipping">
              <div className="mt-6">
                {cart.shipping_methods.map((method) => (
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
                  label: "Edit Shipping Address",
                  icon: <TruckIcon size={"20"} />,
                  onClick: () =>
                    setAddressModal({
                      address: cart?.shipping_address,
                      type: "shipping",
                    }),
                },
                {
                  label: "Edit Billing Address",
                  icon: <DollarSignIcon size={"20"} />,
                  onClick: () => {
                    if (cart.billing_address) {
                      setAddressModal({
                        address: cart?.billing_address,
                        type: "billing",
                      })
                    }
                  },
                },
                {
                  label: "Go to Customer",
                  icon: <DetailsIcon size={"20"} />, // TODO: Change to Contact icon
                  onClick: () => navigate(`/a/customers/${cart.customer.id}`),
                },
              ]}
            >
              <div className="mt-6">
                <div className="flex w-full space-x-4 items-center">
                  <div className="flex w-[40px] h-[40px] ">
                    <Avatar
                      user={cart?.customer}
                      font="inter-large-semibold"
                      color="bg-fuschia-40"
                    />
                  </div>
                  <div>
                    <h1 className="inter-large-semibold text-grey-90">
                      {`${cart?.shipping_address.first_name} ${cart?.shipping_address.last_name}`}
                    </h1>
                    <span className="inter-small-regular text-grey-50">
                      {cart?.shipping_address.city},{" "}
                      {cart?.shipping_address.country_code}
                    </span>
                  </div>
                </div>
                <div className="flex mt-6 space-x-6 divide-x">
                  <div className="flex flex-col">
                    <div className="inter-small-regular text-grey-50 mb-1">
                      Contact
                    </div>
                    <div className="flex flex-col inter-small-regular">
                      <span>{cart?.email}</span>
                      <span>{cart?.shipping_address?.phone || ""}</span>
                    </div>
                  </div>
                  <Address title={"Shipping"} addr={cart?.shipping_address} />
                  <Address title={"Billing"} addr={cart?.billing_address} />
                </div>
              </div>
            </BodyCard>
            <BodyCard
              className={"w-full mb-4 min-h-0 h-auto"}
              title="Raw Draft Order"
            >
              <ReactJson
                style={{ marginTop: "15px" }}
                name={false}
                collapsed={true}
                src={draft_order!}
              />
            </BodyCard>
          </div>
        </div>
      )}
      {/* {addressModal && (
        <AddressModal
          handleClose={() => setAddressModal(null)}
          handleSave={(obj) => handleUpdateAddress(obj)}
          address={addressModal.address}
          type={addressModal.type}
          email={cart?.email}
        />
      )} */}
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

export default DraftOrderDetails
