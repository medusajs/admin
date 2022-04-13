import React from "react"
import { Controller } from "react-hook-form"
import Accordion from "../../../../components/organisms/accordion"
import RadioGroup from "../../../../components/organisms/radio-group"
import { usePriceListForm } from "../form/pricing-form-context"
import { PriceListType } from "../types"

const Type = () => {
  const { control } = usePriceListForm()

  return (
    <Accordion.Item
      forceMountContent
      required
      value="type"
      title="Price list type"
      subtitle="Select the type of the price list"
      tooltip="Define whether the price list is a price override or a sale price list. Sales are used to define sale prices e.g. a Black Friday sale. An override is useful for defining e.g. B2B prices."
    >
      <Controller
        name="type"
        control={control}
        rules={{ required: true }}
        render={({ onChange, value }) => {
          return (
            <RadioGroup.Root
              value={value}
              onValueChange={onChange}
              className="flex items-center gap-base mt-5"
            >
              <RadioGroup.Item
                value={PriceListType.SALE}
                className="flex-1"
                label="Sale"
                description="Price list contains sale prices"
              />
              <RadioGroup.Item
                value={PriceListType.OVERRIDE}
                className="flex-1"
                label="Override"
                description="Price list contains price overrides"
              />
            </RadioGroup.Root>
          )
        }}
      />
    </Accordion.Item>
  )
}

export default Type
