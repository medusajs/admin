import { Discount } from "@medusajs/medusa"
import clsx from "clsx"
import React, { useEffect, useState } from "react"
import { Controller } from "react-hook-form"
import DatePicker from "../../../../components/atoms/date-picker/date-picker"
import TimePicker from "../../../../components/atoms/date-picker/time-picker"
import Switch from "../../../../components/atoms/switch"
import AvailabilityDuration from "../../../../components/molecules/availability-duration"
import InputField from "../../../../components/molecules/input"
import Accordion from "../../../../components/organisms/accordion"
import { usePromotionForm } from "../form/promotion-form-context"

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

  if (promotion.valid_duration !== null) {
    activeTabs.push("valid_duration")
  }

  return activeTabs
}

const Settings: React.FC<SettingsProps> = ({ promotion, isEdit = false }) => {
  const {
    register,
    control,
    isDynamic,
    hasExpiryDate,
    startsAt,
    setStartsAt,
    endsAt,
    setEndsAt,
    handleConfigurationChanged,
  } = usePromotionForm()

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
          handleConfigurationChanged(values)

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
              subtitle="Schedule the promotion to activate in the future."
              tooltip="If you want to schedule the promotion to activate in the future, you can set a start date here, otherwise the promotion will be active immediately."
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
              title="Promotion has an expiry date?"
              subtitle="Schedule the promotion to deactivate in the future."
              tooltip="If you want to schedule the promotion to deactivate in the future, you can set an expiry date here."
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
              tooltip="If you wish to limit the amount of times a customer can redeem this promotion, you can set a limit here."
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
                subtitle="Set the duration of the promotion."
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
    </div>
  )
}

export default Settings
