import React, { useContext, useEffect, useState } from "react"
import Input from "../../../../components/molecules/input"
import Button from "../../../../components/fundamentals/button"
import Medusa from "../../../../services/api"
import {
  displayAmount,
  displayUnitPrice,
  extractOptionPrice,
} from "../../../../utils/prices"
import { SteppedContext } from "../../../../components/molecules/modal/stepped-modal"
import Avatar from "../../../../components/atoms/avatar"
import Table from "../../../../components/molecules/table"
import clsx from "clsx"
import PlusIcon from "../../../../components/fundamentals/icons/plus-icon"
import CrossIcon from "../../../../components/fundamentals/icons/cross-icon"
import ImagePlaceholder from "../../../../components/fundamentals/image-placeholder"

const Summary = ({ items, showCustomPrice, customOptionPrice, form }) => {
  const [showAddDiscount, setShowAddDiscount] = useState(false)
  const [checkingDiscount, setCheckingDiscount] = useState(false)
  const [discError, setDiscError] = useState(false)
  const [code, setCode] = useState()

  const {
    shipping,
    billing,
    email,
    region,
    discount,
    requireShipping,
    shippingOption,
  } = form.watch([
    "shipping",
    "billing",
    "email",
    "region",
    "discount",
    "requireShipping",
    "shippingOption",
  ])

  const handleAddDiscount = async () => {
    setCheckingDiscount(true)

    try {
      const { data } = await Medusa.discounts.retrieveByCode(code)
      // if no discount is found
      if (!data.discount) {
        setDiscError(true)
        return
      }

      // if discount is not available in region
      if (!data.discount.regions.find((d) => d.id === region.id)) {
        setDiscError(true)
      }

      setCode("")
      setShowAddDiscount(false)
      form.setValue("discount", data.discount)
    } catch (error) {
      setDiscError(true)
    }
    setCheckingDiscount(false)
  }

  const onDiscountRemove = () => {
    form.setValue("discount", {})
    setShowAddDiscount(false)
    setCode("")
  }

  useEffect(() => {
    form.register("discount")
  }, [])

  return (
    <div className="min-h-[705px]">
      <SummarySection title={"Items"} editIndex={1}>
        <Table>
          <Table.HeadRow className="text-grey-50 border-t inter-small-semibold">
            <Table.HeadCell>Details</Table.HeadCell>
            <Table.HeadCell className="text-right">Quantity</Table.HeadCell>
            <Table.HeadCell className="text-right">
              Price (excl. Taxes)
            </Table.HeadCell>
            <Table.HeadCell></Table.HeadCell>
          </Table.HeadRow>
          {items.map((item, index) => {
            const displayPrice = displayUnitPrice(item, region)

            return (
              <Table.Row className={clsx("border-b-grey-0 hover:bg-grey-0")}>
                <Table.Cell>
                  <div className="min-w-[240px] flex py-2">
                    <div className="w-[30px] h-[40px] ">
                      {item?.product?.thumbnail ? (
                        <img
                          className="h-full w-full object-cover rounded"
                          src={item.product.thumbnail}
                        />
                      ) : (
                        <ImagePlaceholder />
                      )}
                    </div>
                    <div className="inter-small-regular text-grey-50 flex flex-col ml-4">
                      <span>
                        <span className="text-grey-90">
                          {item.product?.title}
                        </span>{" "}
                      </span>
                      <span>{item?.title || ""}</span>
                    </div>
                  </div>
                </Table.Cell>
                <Table.Cell className="text-right">
                  {item.quantity || ""}
                </Table.Cell>
                <Table.Cell className="text-right">{displayPrice}</Table.Cell>
              </Table.Row>
            )
          })}
        </Table>
        {!showAddDiscount && !discount?.rule && (
          <div className="w-full flex justify-end">
            <Button
              variant="ghost"
              size="small"
              className="border border-grey-20 inter-small-semibold"
              onClick={() => setShowAddDiscount(true)}
            >
              <PlusIcon size={20} />
              Add Discount
            </Button>
          </div>
        )}
        {showAddDiscount && !discount?.rule && (
          <>
            <div className="flex w-full items-center gap-x-base">
              <Input
                type="text"
                placeholder="SUMMER10"
                invalid={discError}
                onFocus={() => setDiscError(false)}
                fontSize="12px"
                onChange={({ currentTarget }) => setCode(currentTarget.value)}
                value={code || null}
              />
              <Button
                className=""
                variant="ghost"
                className="text-grey-40 w-8 h-8"
                size="small"
                onClick={() => setShowAddDiscount(false)}
              >
                <CrossIcon size={20} />
              </Button>
            </div>
            <div className="w-full flex justify-end mt-4 ">
              <Button
                className="border h-full border-grey-20"
                variant="ghost"
                size="small"
                disabled={!code}
                loading={checkingDiscount}
                onClick={() => handleAddDiscount()}
              >
                <PlusIcon size={20} />
                Add Discount
              </Button>
            </div>
          </>
        )}
        {discount?.rule && (
          <div className="flex flex-col w-full border-b border-t border-grey-20 pt-4 mt-4 last:border-b-0 inter-small-regular ">
            <div className="flex w-full justify-between inter-base-semibold mb-4">
              <span>
                Discount
                <span className="inter-base-regular text-grey-50 ml-0.5">
                  (Code: {discount.code})
                </span>
              </span>
              <span
                onClick={() => onDiscountRemove()}
                className="inter-small-semibold text-violet-60 cursor-pointer"
              >
                <CrossIcon size={20} />
              </span>
            </div>
            <div className="flex w-full">
              <div
                className={clsx("flex flex-col border-grey-20 pr-6", {
                  "border-r": discount.rule.type !== "free_shipping",
                })}
              >
                <span className="text-grey-50">Type</span>
                <span>
                  {discount.rule.type !== "free_shipping"
                    ? `${discount.rule.type
                        .charAt(0)
                        .toUpperCase()}${discount.rule.type.slice(1)}`
                    : "Free Shipping"}
                </span>
              </div>
              {discount.rule.type !== "free_shipping" && (
                <div className="pl-6 flex flex-col">
                  <span className="text-grey-50">Value</span>
                  <span>
                    {discount.rule.type === "fixed"
                      ? `${displayAmount(
                          region.currency_code,
                          discount.rule.value
                        )} ${region.currency_code.toUpperCase()}`
                      : `${discount.rule.value} %`}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </SummarySection>
      <SummarySection title={"Customer"} editIndex={2}>
        <div className="flex items-center">
          <div className="w-5 h-5 mr-3">
            <Avatar
              color="bg-fuschia-40"
              user={{
                email,
                first_name: shipping.first_name,
                last_name: shipping.last_name,
              }}
              font="inter-small-regular"
            />
          </div>
          {email}
        </div>
      </SummarySection>
      {requireShipping && (
        <SummarySection title={"Shipping details"} editIndex={4}>
          <div className="flex w-full">
            <div className="border-r flex flex-col border-grey-20 pr-6">
              <span className="text-grey-50">Address</span>
              <span>
                {shipping.address_1}, {shipping.address_2}
              </span>
              <span>
                {`${shipping.postal_code} ${shipping.city}
                ${shipping.country_code.toUpperCase()}`}
              </span>
            </div>
            <div className="pl-6 flex flex-col">
              <span className="text-grey-50">Shipping method</span>
              <span>
                {shippingOption.name} -{" "}
                {showCustomPrice && customOptionPrice ? (
                  <>
                    <strike style={{ marginRight: "5px" }}>
                      {extractOptionPrice(shippingOption.amount, region)}
                    </strike>
                    {customOptionPrice} {region.currency_code.toUpperCase()}
                  </>
                ) : (
                  extractOptionPrice(shippingOption.amount, region)
                )}
              </span>
            </div>
          </div>
        </SummarySection>
      )}
      <SummarySection title={"Billing details"} editIndex={4}>
        <span className="text-grey-50">Address</span>
        <span>
          {billing.address_1}, {billing.address_2}
        </span>
        <span>
          {`${billing.postal_code} ${billing.city}
                ${billing.country_code.toUpperCase()}`}
        </span>
      </SummarySection>
    </div>
  )
}

const SummarySection = ({ title, editIndex, children }) => {
  const { setPage } = useContext(SteppedContext)
  return (
    <div className="flex flex-col w-full border-b border-grey-20 mt-4 pb-8 last:border-b-0 inter-small-regular ">
      <div className="flex w-full justify-between inter-base-semibold mb-4">
        {title}
        <span
          onClick={() => setPage(editIndex)}
          className="inter-small-semibold text-violet-60 cursor-pointer"
        >
          Edit
        </span>
      </div>
      {children}
    </div>
  )
}
export default Summary
