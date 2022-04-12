import clsx from "clsx"
import { useAdminCustomerGroups } from "medusa-react"
import React, { useState } from "react"
import { Controller } from "react-hook-form"
import DatePicker from "../../../../components/atoms/date-picker/date-picker"
import TimePicker from "../../../../components/atoms/date-picker/time-picker"
import Switch from "../../../../components/atoms/switch"
import Select from "../../../../components/molecules/select"
import Accordion from "../../../../components/organisms/accordion"
import { useCreatePriceListForm } from "../form/pricing-form-context"

const Configuration = () => {
  const { customer_groups, isLoading } = useAdminCustomerGroups()
  const [openItems, setOpenItems] = useState<string[]>([])

  const { control } = useCreatePriceListForm()

  return (
    <div className="mt-5">
      <Accordion.Item
        headingSize="medium"
        forceMountContent
        className="border-b-0"
        title="Price overrides has a start date?"
        subtitle="Schedule the price overrides to activate in the future."
        value="starts_at"
        customTrigger={<Switch checked={openItems.indexOf("starts_at") > -1} />}
      >
          {({ open }) => }
        <div
          className={clsx(
            "flex items-center gap-xsmall accordion-margin-transition mt-4",
            {
              "mt-4": openItems.indexOf("starts_at") > -1,
            }
          )}
        >
          <Controller
            name="starts_at"
            control={control}
            render={({ value, onChange }) => {
              return (
                <DatePicker
                  date={value}
                  label="Start date"
                  onSubmitDate={onChange}
                />
              )
            }}
          />
          <Controller
            name="starts_at"
            control={control}
            render={({ value, onChange }) => {
              return (
                <TimePicker
                  date={value}
                  label="Start date"
                  onSubmitDate={onChange}
                />
              )
            }}
          />
        </div>
      </Accordion.Item>
      <Accordion.Item
        headingSize="medium"
        forceMountContent
        className="border-b-0"
        title="Price overrides has an expiry date?"
        subtitle="Schedule the price overrides to deactivate in the future."
        value="ends_at"
        customTrigger={<Switch checked={openItems.indexOf("starts_at") > -1} />}
      >
        <div
          className={clsx(
            "flex items-center gap-xsmall accordion-margin-transition",
            {
              "mt-4": openItems.indexOf("ends_at") > -1,
            }
          )}
        >
          <Controller
            name="ends_at"
            control={control}
            render={({ value, onChange }) => {
              return (
                <DatePicker
                  date={value}
                  label="End date"
                  onSubmitDate={onChange}
                />
              )
            }}
          />
          <Controller
            name="ends_at"
            control={control}
            render={({ value, onChange }) => {
              return (
                <TimePicker
                  date={value}
                  label="End date"
                  onSubmitDate={onChange}
                />
              )
            }}
          />
        </div>
      </Accordion.Item>
      <Accordion.Item
        headingSize="medium"
        forceMountContent
        className="border-b-0"
        title="Customer availabilty"
        subtitle="Specifiy which customer groups the price overrides should apply for."
        value="customer_groups"
        customTrigger={
          <Switch checked={openItems.indexOf("customer_groups") > -1} />
        }
      >
        <div
          className={clsx(
            "flex items-center gap-xsmall accordion-margin-transition",
            {
              "mt-4": openItems.indexOf("customer_groups") > -1,
            }
          )}
        >
          <Controller
            name="customer_groups"
            control={control}
            render={({ value, onChange }) => {
              return (
                <Select
                  value={value}
                  label="Customer Groups"
                  onChange={onChange}
                  isMultiSelect
                  isLoading={isLoading}
                  options={
                    customer_groups?.map((cg) => ({
                      value: cg.id,
                      label: cg.name,
                    })) || []
                  }
                />
              )
            }}
          />
        </div>
      </Accordion.Item>
    </div>
  )
}

export default Configuration
