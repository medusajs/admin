import React from "react"
import Checkbox from "../../atoms/checkbox"
import InfoTooltip from "../../molecules/info-tooltip"
import InputField from "../../molecules/input"
import BodyCard from "../../organisms/body-card"
import RadioGroup from "../../organisms/radio-group"

type DiscountSettingsProps = {}

type SectionProps = {
  title: string
  description: string
  tooltip?: string
}

const Section: React.FC<SectionProps> = ({
  title,
  description,
  tooltip,
  children,
}) => {
  return (
    <div>
      <div className="flex items-center mb-2xsmall">
        <h3 className="inter-base-semibold">{title}</h3>
        {tooltip && (
          <div className="flex items-center ml-1.5">
            <InfoTooltip content={tooltip} />
          </div>
        )}
      </div>
      <p className="inter-small-regular text-grey-50 mb-base">{description}</p>
      {children}
    </div>
  )
}

const DiscountSettings: React.FC<DiscountSettingsProps> = ({}) => {
  return (
    <BodyCard
      title="Settings"
      subtitle="Manage the settings for your discount"
      className="h-auto"
    >
      <div className="max-w-xl flex flex-col gap-y-xlarge">
        <Section
          title="Limit the number of redemptions?"
          description="Limit applies across all customers, not per customer."
          tooltip="If you wish to limit the amount of times a customer can redeem this discount, you can set a limit here."
        >
          <InputField
            label="Number of redemptions"
            type="number"
            placeholder="5"
          />
        </Section>
        <Section
          title="Structure"
          description="Select whether the discount should be price discount or a free shipping discount."
          tooltip="If you wish to limit the amount of times a customer can redeem this discount, you can set a limit here."
        >
          <RadioGroup className="flex items-center">
            <RadioGroup.SimpleItem value="discount" label="Discount" />
            <RadioGroup.SimpleItem value="shipping" label="Free Shipping" />
          </RadioGroup>
        </Section>
        <Section
          title="Discount applies to specific products?"
          description="Select which product(s) the discount applies to."
          tooltip="Select whether the discount should apply to all products or only to specific products."
        >
          <RadioGroup className="flex items-center">
            <RadioGroup.SimpleItem value="all" label="All products" />
            <RadioGroup.SimpleItem value="specific" label="Specific products" />
          </RadioGroup>
        </Section>
        <Section
          title="Discount has a start date?"
          description="Schedule the discount to activate in the future."
          tooltip="If you want to schedule the discount to activate in the future, you can set a start date here."
        ></Section>
        <Section
          title="Discount has an expiry date?"
          description="Schedule the discount to deactivate in the future."
          tooltip="If you want to schedule the discount to deactivate in the future, you can set an expiry date here."
        ></Section>
        <div className="flex items-center">
          <Checkbox
            label="Availability Duration"
            value="duration"
            className="mr-1.5"
          />
          <InfoTooltip content={"Duration"} />
        </div>
      </div>
    </BodyCard>
  )
}

export default DiscountSettings
