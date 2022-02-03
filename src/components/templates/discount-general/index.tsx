import clsx from "clsx"
import React from "react"
import Checkbox from "../../atoms/checkbox"
import DuplicateIcon from "../../fundamentals/icons/duplicate-icon"
import TrashIcon from "../../fundamentals/icons/trash-icon"
import { ActionType } from "../../molecules/actionables"
import InfoTooltip from "../../molecules/info-tooltip"
import InputField from "../../molecules/input"
import ConnectForm from "../../molecules/nested-form"
import Select from "../../molecules/select"
import StatusSelector from "../../molecules/status-selector"
import Textarea from "../../molecules/textarea"
import BodyCard from "../../organisms/body-card"
import RadioGroup from "../../organisms/radio-group"

type DiscountGeneralProps = {
  isEdit: boolean
  isDisabled: boolean
  subtitle: string
  regionOptions: { label: string; value: string }[]
  selectedRegions: { label: string; value: string }[]
  setSelectedRegions: React.Dispatch<
    React.SetStateAction<
      {
        label: string
        value: string
      }[]
    >
  >
  discountType: string
  setDiscountType: React.Dispatch<React.SetStateAction<string>>
  isFreeShipping: boolean
  isDynamic: boolean
  setIsDynamic: React.Dispatch<React.SetStateAction<boolean>>
  regionIsDisabled?: boolean
  onDelete?: () => void
  onDuplicate?: () => void
  onStatusChange?: () => void
  nativeSymbol?: string
}

const DiscountGeneral: React.FC<DiscountGeneralProps> = ({
  subtitle,
  isEdit,
  regionOptions,
  selectedRegions,
  setSelectedRegions,
  discountType,
  setDiscountType,
  isDisabled,
  isFreeShipping,
  isDynamic,
  setIsDynamic,
  regionIsDisabled = false,
  onDelete,
  onDuplicate,
  onStatusChange,
  nativeSymbol,
}) => {
  const editActions: ActionType[] = [
    {
      label: "Dublicate",
      onClick: () => {
        if (onDuplicate) {
          onDuplicate()
        }
      },
      icon: <DuplicateIcon size={20} />,
    },
    {
      label: "Delete",
      onClick: () => {
        if (onDelete) {
          onDelete()
        }
      },
      icon: <TrashIcon size={20} />,
      variant: "danger",
    },
  ]

  return (
    <BodyCard
      title="General"
      subtitle={subtitle}
      className="h-auto"
      actionables={isEdit ? editActions : undefined}
      status={
        isEdit ? (
          <StatusSelector
            isDraft={isDisabled}
            activeState="Active"
            draftState="Draft"
            onChange={() => {
              if (onStatusChange) {
                onStatusChange()
              }
            }}
          />
        ) : undefined
      }
    >
      <div className="mt-large">
        <ConnectForm>
          {({ register }) => (
            <div>
              <h3 className="inter-base-semibold mb-2xsmall">
                General information
              </h3>
              <p className="inter-small-regular text-grey-50">
                The code your customers will enter during checkout. Uppercase
                letters and numbers only.
              </p>
              <div className="flex gap-x-xlarge mt-base w-full">
                <div className="flex flex-col w-1/2 gap-y-base">
                  <InputField
                    label="Code"
                    placeholder="SUMMERSALE10"
                    required
                    name="code"
                    ref={register({ required: true })}
                  />
                  <Select
                    label="Choose valid regions"
                    options={regionOptions}
                    isMultiSelect
                    enableSearch
                    value={selectedRegions}
                    onChange={setSelectedRegions}
                    required
                    hasSelectAll
                    className={clsx({
                      ["opacity-50 pointer-events-none select-none"]: regionIsDisabled,
                    })}
                    disabled={regionIsDisabled}
                  />
                  <InputField
                    label="Amount"
                    required
                    type="number"
                    placeholder="10"
                    prefix={discountType === "percentage" ? "%" : nativeSymbol}
                    name="rule.value"
                    ref={register({ required: !isFreeShipping })}
                    className={clsx({
                      ["opacity-50 pointer-events-none select-none"]:
                        isFreeShipping || isEdit,
                    })}
                    tabIndex={isFreeShipping || isEdit ? -1 : 0}
                    disabled={isFreeShipping || isEdit}
                  />
                </div>
                <Textarea
                  label="Description"
                  required
                  className="w-1/2"
                  placeholder="Summer Sale 2022"
                  name="rule.description"
                  ref={register({ required: true })}
                />
              </div>
              <RadioGroup.Root
                value={isFreeShipping ? undefined : discountType}
                onValueChange={(e) => setDiscountType(e)}
                className={clsx("flex items-center mt-base", {
                  ["opacity-50 pointer-events-none select-none"]:
                    isFreeShipping || isEdit,
                })}
                tabIndex={isFreeShipping ? -1 : 0}
              >
                <RadioGroup.SimpleItem
                  value="percentage"
                  label="Percentage discount"
                />
                <RadioGroup.SimpleItem
                  value="fixed"
                  label="Fixed amount discount"
                  disabled={selectedRegions.length > 1}
                />
                {selectedRegions.length > 1 && (
                  <div className="flex items-center">
                    <InfoTooltip
                      content={
                        "Fixed value discounts are not available for multi regional discounts"
                      }
                    />
                  </div>
                )}
              </RadioGroup.Root>
              <div className="mt-xlarge flex items-center">
                <Checkbox
                  label="This is a template discount"
                  name="is_dynamic"
                  checked={isDynamic}
                  onChange={(e) => setIsDynamic(e.target.checked)}
                  disabled={isEdit}
                  className={clsx("mr-1.5", {
                    ["opacity-50 pointer-events-none select-none"]: isEdit,
                  })}
                />
                <InfoTooltip
                  content={
                    "Template discounts allow you to define a set of rules that can be used across a group of discounts. This is useful in campaigns that should generate unique codes for each user, but where the rules for all unique codes should be the same."
                  }
                />
              </div>
            </div>
          )}
        </ConnectForm>
      </div>
    </BodyCard>
  )
}

export default DiscountGeneral
