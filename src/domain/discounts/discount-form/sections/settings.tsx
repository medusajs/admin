import { Discount } from "@medusajs/medusa"
import clsx from "clsx"
import React, { useEffect, useRef, useState } from "react"
import { Controller } from "react-hook-form"
import Checkbox from "../../../../components/atoms/checkbox"
import DatePicker from "../../../../components/atoms/date-picker/date-picker"
import TimePicker from "../../../../components/atoms/date-picker/time-picker"
import Switch from "../../../../components/atoms/switch"
import AvailabilityDuration from "../../../../components/molecules/availability-duration"
import IconTooltip from "../../../../components/molecules/icon-tooltip"
import InputField from "../../../../components/molecules/input"
import Section from "../../../../components/molecules/section"
import Accordion from "../../../../components/organisms/accordion"
import RadioGroup from "../../../../components/organisms/radio-group"
import { useDiscountForm } from "../form/discount-form-context"

type SettingsProps = {
  isEdit?: boolean
  promotion?: Discount
}

const getActiveTabs = (promotion: Discount) => {
  const activeTabs: string[] = []

  if (promotion.usage_limit !== null) {
    activeTabs.push("usage_limit")
  }

  if (promotion.starts_at !== null) {
    activeTabs.push("starts_at")
  }

  if (promotion.ends_at !== null) {
    activeTabs.push("ends_at")
  }

  return activeTabs
}

const Settings: React.FC<SettingsProps> = ({ promotion, isEdit = false }) => {
  const {
    isFreeShipping,
    setIsFreeShipping,
    register,
    control,
    isDynamic,
    hasExpiryDate,
    setHasExpiryDate,
    startsAt,
    setStartsAt,
    endsAt,
    setEndsAt,
  } = useDiscountForm()

  const [openItems, setOpenItems] = React.useState<string[]>(
    isEdit && promotion
      ? getActiveTabs(promotion)
      : [...(hasExpiryDate ? ["ends_at"] : [])]
  )

  const marginTransition =
    "transition-[margin] duration-300 ease-[cubic-bezier(0.87, 0, 0.13, 1) forwards]"

  const [render, setRender] = useState(false)
  useEffect(() => {
    setTimeout(() => setRender(true), 300)
  }, [])

  return (
    <div className="flex flex-col">
      <Accordion
        className="pt-7 text-grey-90"
        type="multiple"
        value={openItems || []}
        onValueChange={(values) => {
          if (values.indexOf("ends_at") > -1 && !hasExpiryDate) {
            setHasExpiryDate(true)
          } else if (values.indexOf("ends_at") === -1 && hasExpiryDate) {
            setHasExpiryDate(false)
          }
          setOpenItems(values)
        }}
      >
        {render && (
          <>
            <Accordion.Item
              headingSize="medium"
              forceMountContent
              className="border-b-0"
              title="Start date"
              subtitle="Schedule the discount to activate in the future."
              tooltip="If you want to schedule the discount to activate in the future, you can set a start date here, otherwise the discount will be active immediately."
              value="starts_at"
              customTrigger={
                <Switch checked={openItems.indexOf("starts_at") > -1} />
              }
            >
              <div
                className={clsx(
                  "flex items-center gap-xsmall",
                  marginTransition,
                  {
                    "mt-4": openItems.indexOf("starts_at") > -1,
                  }
                )}
              >
                <DatePicker
                  date={startsAt}
                  label="Start date"
                  onSubmitDate={setStartsAt}
                />
                <TimePicker
                  label="Start time"
                  date={startsAt}
                  onSubmitDate={setStartsAt}
                />
              </div>
            </Accordion.Item>
            <Accordion.Item
              headingSize="medium"
              forceMountContent
              className="border-b-0"
              title="Discount has an expiry date?"
              subtitle="Schedule the discount to deactivate in the future."
              tooltip="If you want to schedule the discount to deactivate in the future, you can set an expiry date here."
              value="ends_at"
              customTrigger={
                <Switch checked={openItems.indexOf("ends_at") > -1} />
              }
            >
              <div
                className={clsx(
                  "flex items-center gap-xsmall",
                  marginTransition,
                  {
                    "mt-4": openItems.indexOf("ends_at") > -1,
                  }
                )}
              >
                <DatePicker
                  label="Expiry date"
                  date={endsAt ?? new Date()}
                  onSubmitDate={setEndsAt}
                />
                <TimePicker
                  label="Expiry time"
                  date={endsAt ?? new Date()}
                  onSubmitDate={setEndsAt}
                />
              </div>
            </Accordion.Item>
            <Accordion.Item
              headingSize="medium"
              forceMountContent
              className="border-b-0"
              title="Limit the number of redemptions?"
              subtitle="Limit applies across all customers, not per customer."
              tooltip="If you wish to limit the amount of times a customer can redeem this discount, you can set a limit here."
              value="usage_limit"
              customTrigger={
                <Switch checked={openItems.indexOf("usage_limit") > -1} />
              }
            >
              <div
                className={clsx(marginTransition, {
                  "mt-4": openItems.indexOf("usage_limit") > -1,
                })}
              >
                <InputField
                  name="usage_limit"
                  ref={register}
                  label="Number of redemptions"
                  type="number"
                  placeholder="5"
                  min={1}
                />
              </div>
            </Accordion.Item>

            {isDynamic && (
              <Accordion.Item
                disabled={!isDynamic}
                headingSize="medium"
                forceMountContent
                title="Availability duration?"
                className="border-b-0"
                subtitle="Set the duration of the discount."
                tooltip="Select a promotion type"
                value="valid_duration"
                customTrigger={
                  <Switch checked={openItems.indexOf("valid_duration") > -1} />
                }
              >
                <div
                  className={clsx(marginTransition, {
                    "mt-4": openItems.indexOf("valid_duration") > -1,
                  })}
                >
                  <Controller
                    name="valid_duration"
                    control={control}
                    render={({ value, onChange }) => {
                      return (
                        <AvailabilityDuration
                          value={value}
                          onChange={onChange}
                        />
                      )
                    }}
                  />
                </div>
              </Accordion.Item>
            )}
          </>
        )}
      </Accordion>
      {/* <Section
        title="Limit the number of redemptions?"
        description="Limit applies across all customers, not per customer."
        tooltip="If you wish to limit the amount of times a customer can redeem this discount, you can set a limit here."
      >
        <InputField
          name="usage_limit"
          ref={register}
          label="Number of redemptions"
          type="number"
          placeholder="5"
          min={1}
        />
      </Section> */}
      {/* <Section
          title="Structure"
          description="Select whether the discount should be price discount or a free shipping discount."
          tooltip="If you wish to limit the amount of times a customer can redeem this discount, you can set a limit here."
        >
          <RadioGroup.Root
            value={isFreeShipping ? "true" : "false"}
            onValueChange={(value) => {
              setIsFreeShipping(value === "true")
            }}
            className="flex items-center gap-base"
          >
            <RadioGroup.SimpleItem
              value="false"
              label="Discount"
              disabled={isEdit}
            />
            <RadioGroup.SimpleItem
              value="true"
              label="Free Shipping"
              disabled={isEdit}
            />
          </RadioGroup.Root>
        </Section> */}
      {/* <Section
        title="Allocation"
        description="Select whether the discount should be applied to the cart total or on a per item basis."
        tooltip="Select whether the discount applies to the cart total or to individual items."
      >
        <Controller
          name="allocation"
          control={control}
          render={({ value, onChange }) => {
            return (
              <RadioGroup.Root
                className="flex items-center"
                value={value}
                onValueChange={onChange}
              >
                <RadioGroup.SimpleItem
                  value="total"
                  label="Total"
                  disabled={isFreeShipping || isEdit}
                />
                <RadioGroup.SimpleItem
                  value="item"
                  label="Item"
                  disabled={isFreeShipping || isEdit}
                />
              </RadioGroup.Root>
            )
          }}
        />
      </Section> */}
      {/* <Section
        title="Discount applies to specific products?"
        description="Select which product(s) the discount applies to."
        tooltip="Select whether the discount should apply to all products or only to specific products."
      >
        <RadioGroup.Root
          className="flex items-center"
          value={appliesToAll ? "all" : "specific"}
          onValueChange={(value) => {
            setAppliesToAll(value === "all")
          }}
        >
          <RadioGroup.SimpleItem
            value="all"
            label="All products"
            disabled={isEdit}
          />
          <RadioGroup.SimpleItem
            value="specific"
            label="Specific products"
            disabled={isEdit}
          />
        </RadioGroup.Root>
        {!appliesToAll && (
          <div className="mt-large">
            <Controller
              control={control}
              name="valid_for"
              render={({ onChange, value }) => {
                return (
                  <Select
                    isMultiSelect
                    enableSearch
                    clearSelected
                    options={productOptions}
                    label="Products"
                    value={value}
                    onChange={onChange}
                    disabled={isEdit}
                  />
                )
              }}
            />
          </div>
        )}
      </Section> */}
      {/* <Section
        title="Start date"
        description="Schedule the discount to activate in the future."
        tooltip="If you want to schedule the discount to activate in the future, you can set a start date here, otherwise the discount will be active immediately."
      >
        <div className="flex items-center gap-xsmall">
          <DatePicker
            date={startsAt}
            label="Start date"
            onSubmitDate={setStartsAt}
          />
          <TimePicker
            label="Start time"
            date={startsAt}
            onSubmitDate={setStartsAt}
          />
        </div>
      </Section> */}
      {/* <div>
        <div className="flex items-center mb-2xsmall">
          <Checkbox
            label="Discount has an expiry date?"
            checked={hasExpiryDate}
            onChange={() => setHasExpiryDate(!hasExpiryDate)}
          />
          <div className="flex items-center ml-1.5">
            <IconTooltip
              content={
                "If you want to schedule the discount to deactivate in the future, you can set an expiry date here."
              }
            />
          </div>
        </div>
        {hasExpiryDate && (
          <div>
            <p className="inter-small-regular text-grey-50 mb-base">
              Schedule the discount to deactivate in the future.
            </p>
            <div className="flex items-center gap-xsmall">
              <DatePicker
                label="Expiry date"
                date={endsAt ?? new Date()}
                onSubmitDate={setEndsAt}
              />
              <TimePicker
                label="Expiry time"
                date={endsAt ?? new Date()}
                onSubmitDate={setEndsAt}
              />
            </div>
          </div>
        )}
      </div>
      {isDynamic && (
        <Controller
          name="valid_duration"
          control={control}
          render={({ value, onChange }) => {
            return <AvailabilityDuration value={value} onChange={onChange} />
          }}
        />
      )} */}
    </div>
  )
}

export default Settings
