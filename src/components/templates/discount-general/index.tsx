import React from "react"
import { useForm } from "react-hook-form"
import Checkbox from "../../atoms/checkbox"
import InfoTooltip from "../../molecules/info-tooltip"
import InputField from "../../molecules/input"
import Select from "../../molecules/select"
import Textarea from "../../molecules/textarea"
import BodyCard from "../../organisms/body-card"
import RadioGroup from "../../organisms/radio-group"

type DiscountGeneralProps = {
  isEdit: boolean
  subtitle: string
  regionOptions: { label: string; value: string }[]
  currentRegion?: { label: string; value: string }
}

const DiscountGeneral: React.FC<DiscountGeneralProps> = ({
  subtitle,
  isEdit,
  regionOptions,
  currentRegion,
}) => {
  const [selectedOptions, setSelectedOptions] = React.useState<
    { label: string; value: string }[]
  >(currentRegion ? [currentRegion] : [])

  const { register, handleSubmit } = useForm()

  return (
    <BodyCard title="General" subtitle={subtitle} className="h-auto w-full">
      <div>
        <h3 className="inter-base-semibold mb-2xsmall">General information</h3>
        <p className="inter-small-regular text-grey-50">
          The code your customers will enter during checkout. Uppercase letters
          and numbers only.
        </p>
        <div className="flex gap-x-xlarge mt-base">
          <div className="flex flex-col w-1/2 gap-y-base">
            <InputField
              label="Code"
              placeholder="SUMMERSALE10"
              required={!isEdit}
            />
            <Select
              label="Choose valid regions"
              options={regionOptions}
              isMultiSelect
              enableSearch
              value={selectedOptions}
              onChange={setSelectedOptions}
              required={!isEdit}
            />
            <InputField
              label="Amount"
              required={!isEdit}
              type="number"
              placeholder="10"
              prefix="%"
            />
          </div>
          <Textarea
            label="Description"
            required={!isEdit}
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
