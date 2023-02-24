import clsx from "clsx"
import {
  useAdminGetDiscountByCode,
  useAdminShippingOptions,
} from "medusa-react"
import { useContext, useEffect, useMemo, useState } from "react"
import { useWatch } from "react-hook-form"
import Avatar from "../../../../components/atoms/avatar"
import Button from "../../../../components/fundamentals/button"
import CrossIcon from "../../../../components/fundamentals/icons/cross-icon"
import PlusIcon from "../../../../components/fundamentals/icons/plus-icon"
import ImagePlaceholder from "../../../../components/fundamentals/image-placeholder"
import Input from "../../../../components/molecules/input"
import { SteppedContext } from "../../../../components/molecules/modal/stepped-modal"
import Table from "../../../../components/molecules/table"
import isNullishObject from "../../../../utils/is-nullish-object"
import { displayAmount, extractOptionPrice } from "../../../../utils/prices"
import { useNewOrderForm } from "../form"

const Summary = () => {
  const [showAddDiscount, setShowAddDiscount] = useState(false)
  const [discError, setDiscError] = useState<string | undefined>(undefined)
  const [code, setCode] = useState<string | undefined>(undefined)

  const {
    form,
    context: { items, region: regionObj, selectedShippingOption },
  } = useNewOrderForm()

  const shipping = useWatch({
    defaultValue: undefined,
    control: form.control,
    name: "shipping_address",
  })

  const billing = useWatch({
    defaultValue: undefined,
    control: form.control,
    name: "billing_address",
  })

  const email = useWatch({
    control: form.control,
    name: "email",
  })

  const region = useWatch({
    control: form.control,
    name: "region",
  })

  const discountCode = useWatch({
    control: form.control,
    name: "discount_code",
  })

  const shippingOption = useWatch({
    control: form.control,
    name: "shipping_option",
  })

  const customShippingPrice = useWatch({
    control: form.control,
    name: "custom_shipping_price",
  })

  const { discount, status, isFetching } = useAdminGetDiscountByCode(
    discountCode!,
    {
      enabled: !!discountCode,
    }
  )

  const { shipping_options } = useAdminShippingOptions(
    { region_id: region?.value },
    {
      enabled: !!region && !!shippingOption,
    }
  )

  const shippingOptionPrice = useMemo(() => {
    if (!shippingOption || !shipping_options) {
      return 0
    }

    const option = shipping_options.find((o) => o.id === shippingOption.value)

    if (!option) {
      return 0
    }

    return option.amount || 0
  }, [shipping_options, shippingOption])

  const handleAddDiscount = async () => {
    form.setValue("discount_code", code)
  }

  useEffect(() => {
    if (!discount || !regionObj) {
      return
    }

    if (!discount.regions.find((d) => d.id === regionObj.id)) {
      setDiscError("The discount is not applicable to the selected region")
      setCode(undefined)
      form.setValue("discount_code", undefined)
      setShowAddDiscount(true)
    }
  }, [discount])

  useEffect(() => {
    if (status === "error") {
      setDiscError("The discount code is invalid")
      setCode(undefined)
      form.setValue("discount_code", undefined)
      setShowAddDiscount(true)
    }
  }, [status])

  const onDiscountRemove = () => {
    form.setValue("discount_code", undefined)
    setShowAddDiscount(false)
    setCode("")
  }

  return (
    <div className="min-h-[705px]">
      <SummarySection title={"Items"} editIndex={1}>
        <Table>
          <Table.Head>
            <Table.HeadRow className="inter-small-semibold border-t text-grey-50">
              <Table.HeadCell>Details</Table.HeadCell>
              <Table.HeadCell className="text-right">Quantity</Table.HeadCell>
              <Table.HeadCell className="text-right">
                Price (excl. Taxes)
              </Table.HeadCell>
              <Table.HeadCell></Table.HeadCell>
            </Table.HeadRow>
          </Table.Head>
          <Table.Body>
            {regionObj &&
              items &&
              items.fields.map((item) => {
                return (
                  <Table.Row
                    key={item.id}
                    className={clsx("border-b-grey-0 hover:bg-grey-0")}
                  >
                    <Table.Cell>
                      <div className="flex min-w-[240px] py-2">
                        <div className="h-[40px] w-[30px] ">
                          {item.thumbnail ? (
                            <img
                              className="h-full w-full rounded object-cover"
                              src={item.thumbnail}
                            />
                          ) : (
                            <ImagePlaceholder />
                          )}
                        </div>
                        <div className="inter-small-regular ml-4 flex flex-col text-grey-50">
                          <span>
                            <span className="text-grey-90">
                              {item.product_title}
                            </span>
                          </span>
                          <span>{item.title}</span>
                        </div>
                      </div>
                    </Table.Cell>
                    <Table.Cell className="text-right">
                      {item.quantity}
                    </Table.Cell>
                    <Table.Cell className="text-right">
                      {displayAmount(regionObj?.currency_code, item.unit_price)}
                    </Table.Cell>
                  </Table.Row>
                )
              })}
          </Table.Body>
        </Table>
        {!showAddDiscount && !discount?.rule && (
          <div className="flex w-full justify-end">
            <Button
              variant="ghost"
              size="small"
              className="inter-small-semibold border border-grey-20"
              onClick={() => setShowAddDiscount(true)}
            >
              <PlusIcon size={20} />
              Add Discount
            </Button>
          </div>
        )}
        {showAddDiscount && !discount?.rule && (
          <>
            <div>
              <div className="flex w-full items-center gap-x-base">
                <Input
                  type="text"
                  placeholder="SUMMER10"
                  onFocus={() => setDiscError(undefined)}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <Button
                  variant="ghost"
                  className="h-8 w-8 text-grey-40"
                  size="small"
                  type="button"
                  onClick={() => setShowAddDiscount(false)}
                >
                  <CrossIcon size={20} />
                </Button>
              </div>
            </div>

            <div className="space-between mt-4 flex w-full justify-between ">
              <div className="pt-2">
                {discError && <span className="text-rose-50">{discError}</span>}
              </div>
              <Button
                className="h-full border border-grey-20"
                variant="ghost"
                size="small"
                loading={isFetching}
                onClick={() => handleAddDiscount()}
              >
                <PlusIcon size={20} />
                Add Discount
              </Button>
            </div>
          </>
        )}
        {discount && regionObj && (
          <div className="inter-small-regular mt-4 flex w-full flex-col border-b border-t border-grey-20 pt-4 last:border-b-0 ">
            <div className="inter-base-semibold mb-4 flex w-full justify-between">
              <span>
                Discount
                <span className="inter-base-regular ml-0.5 text-grey-50">
                  (Code: {discount.code})
                </span>
              </span>
              <span
                onClick={() => onDiscountRemove()}
                className="inter-small-semibold cursor-pointer text-violet-60"
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
                <div className="flex flex-col pl-6">
                  <span className="text-grey-50">Value</span>
                  <span>
                    {discount.rule.type === "fixed"
                      ? `${displayAmount(
                          regionObj.currency_code,
                          discount.rule.value
                        )} ${regionObj.currency_code.toUpperCase()}`
                      : `${discount.rule.value} %`}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </SummarySection>
      <SummarySection title={"Customer"} editIndex={3}>
        <div className="flex items-center">
          <div className="mr-3 h-5 w-5">
            <Avatar
              color="bg-fuschia-40"
              user={{
                email,
                first_name: shipping?.first_name,
                last_name: shipping?.last_name,
              }}
              font="inter-small-regular"
            />
          </div>
          {email}
        </div>
      </SummarySection>

      {selectedShippingOption && (
        <SummarySection title={"Shipping details"} editIndex={2}>
          <div className="grid w-full grid-cols-2 gap-x-6">
            {!isNullishObject(shipping) && shipping && (
              <div className="flex flex-col border-r border-grey-20 pr-6">
                <span className="text-grey-50">Address</span>
                <span>
                  {shipping.address_1}, {shipping.address_2}
                </span>
                <span>
                  {`${shipping.postal_code} ${shipping.city},
                ${shipping.country_code?.label}`}
                </span>
              </div>
            )}
            {regionObj && (
              <div className="flex flex-col">
                <span className="text-grey-50">Shipping method</span>
                <span>
                  {selectedShippingOption.name} -{" "}
                  {customShippingPrice && regionObj ? (
                    <p>
                      <span className="mr-2 text-grey-40 line-through">
                        {extractOptionPrice(shippingOptionPrice, regionObj)}
                      </span>
                      {displayAmount(
                        regionObj.currency_code,
                        customShippingPrice
                      )}
                      {regionObj.currency_code.toUpperCase()}
                    </p>
                  ) : (
                    extractOptionPrice(selectedShippingOption.amount, regionObj)
                  )}
                </span>
              </div>
            )}
          </div>
        </SummarySection>
      )}

      {!isNullishObject(billing) && billing && (
        <SummarySection title={"Billing details"} editIndex={3}>
          <span className="text-grey-50">Address</span>
          <span>
            {billing.address_1}, {billing.address_2}
          </span>
          <span>
            {`${billing.postal_code} ${billing.city},
                ${billing.country_code.label}`}
          </span>
        </SummarySection>
      )}
    </div>
  )
}

const SummarySection = ({ title, editIndex, children }) => {
  const { setPage } = useContext(SteppedContext)
  return (
    <div className="inter-small-regular mt-4 flex w-full flex-col border-b border-grey-20 pb-8 last:border-b-0 ">
      <div className="inter-base-semibold mb-4 flex w-full justify-between">
        {title}
        <span
          onClick={() => setPage(editIndex)}
          className="inter-small-semibold cursor-pointer text-violet-60"
        >
          Edit
        </span>
      </div>
      {children}
    </div>
  )
}
export default Summary
