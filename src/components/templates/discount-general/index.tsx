import React from "react"
import { useForm } from "react-hook-form"
import Checkbox from "../../atoms/checkbox"
import DuplicateIcon from "../../fundamentals/icons/duplicate-icon"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import UnpublishIcon from "../../fundamentals/icons/unpublish-icon"
import StatusIndicator from "../../fundamentals/status-indicator"
import { ActionType } from "../../molecules/actionables"
import InfoTooltip from "../../molecules/info-tooltip"
import InputField from "../../molecules/input"
import Select from "../../molecules/select"
import Textarea from "../../molecules/textarea"
import BodyCard from "../../organisms/body-card"
import RadioGroup from "../../organisms/radio-group"

export enum DiscountRuleType {
  FIXED = "fixed",
  PERCENTAGE = "percentage",
  FREE_SHIPPING = "free_shipping",
}

type DiscountDetailType = {
  is_disabled: boolean
  code: string
  rule: {
    type: DiscountRuleType
    description: string
  }
  regions: {
    id: string
    countries: { display_name: string }[]
    name: string
  }[]
}

type DiscountGeneralProps = {
  isEdit: boolean
  discount?: DiscountDetailType
  subtitle: string
  regionOptions: { label: string; value: string }[]
  currentRegion?: { label: string; value: string }
}

const DiscountGeneral: React.FC<DiscountGeneralProps> = ({
  subtitle,
  isEdit,
  regionOptions,
  currentRegion,
  discount,
}) => {
  const [selectedOptions, setSelectedOptions] = React.useState<
    { label: string; value: string }[]
  >(
    discount
      ? discount.regions.map((r) => ({
          value: r.id,
          label: `${r.name} (${r.countries
            .map((c) => c.display_name)
            .join(", ")})`,
        }))
      : []
  )

  const { register, handleSubmit } = useForm()

  const editActions: ActionType[] = [
    {
      label: "Activate",
      onClick: () => {},
      icon: <UnpublishIcon size={20} />,
    },
    {
      label: "Dublicate",
      onClick: () => {},
      icon: <DuplicateIcon size={20} />,
    },
    {
      label: "Delete",
      onClick: () => {},
      icon: <TrashIcon size={20} />,
      variant: "danger",
    },
  ]

  const statusIndicator = discount ? (
    <StatusIndicator
      variant={discount.is_disabled ? "danger" : "success"}
      title={discount.is_disabled ? "Inactive" : "Active"}
    />
  ) : undefined

  return (
    <BodyCard
      title="General"
      subtitle={subtitle}
      className="h-auto"
      actionables={isEdit ? editActions : undefined}
      status={statusIndicator}
    >
      <div>
        <h3 className="inter-base-semibold mb-2xsmall">General information</h3>
        <p className="inter-small-regular text-grey-50">
          The code your customers will enter during checkout. Uppercase letters
          and numbers only.
        </p>
        <div className="flex gap-x-xlarge mt-base w-full">
          <div className="flex flex-col w-1/2 gap-y-base overflow-hidden">
            <InputField label="Code" placeholder="SUMMERSALE10" required />
            <Select
              label="Choose valid regions"
              options={regionOptions}
              isMultiSelect
              enableSearch
              value={selectedOptions}
              onChange={setSelectedOptions}
              required
              hasSelectAll
              className="z-10"
            />
            <InputField
              label="Amount"
              required
              type="number"
              placeholder="10"
              prefix="%"
            />
          </div>
          <Textarea
            label="Description"
            required
            className="w-1/2"
            placeholder="Summer Sale 2022"
          />
        </div>
        <RadioGroup className="flex items-center mt-base">
          <RadioGroup.SimpleItem
            value="percentage"
            label="Percentage discount"
          />
          <RadioGroup.SimpleItem value="fixed" label="Fixed amount discount" />
        </RadioGroup>
        <div className="mt-xlarge flex items-center">
          <Checkbox
            label="This is a template discount"
            value="template"
            className="mr-1.5"
            name="is_template"
            ref={register}
          />
          <InfoTooltip
            content={
              "Template discounts allow you to define a set of rules that can be used across a group of discounts. This is useful in campaigns that should generate unique codes for each user, but where the rules for all unique codes should be the same."
            }
          />
        </div>
      </div>
    </BodyCard>
  )
}

export default DiscountGeneral
