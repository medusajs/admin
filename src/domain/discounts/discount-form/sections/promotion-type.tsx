import clsx from "clsx"
import React from "react"
import { Controller } from "react-hook-form"
import RadioGroup from "../../../../components/organisms/radio-group"
import { useDiscountForm } from "../form/discount-form-context"

const PromotionType = ({ promotion, isEdit = false }) => {
  const { control, isFreeShipping, setIsFreeShipping } = useDiscountForm()

  return (
    <Controller
      name="type"
      control={control}
      rules={{ required: true }}
      render={({ onChange, value }) => {
        return (
          <RadioGroup.Root
            value={value}
            onValueChange={(values) => {
              if (values === "free_shipping" && !isFreeShipping) {
                setIsFreeShipping(true)
              } else if (values !== "free_shipping" && isFreeShipping) {
                setIsFreeShipping(false)
              }

              onChange(values)
            }}
            className={clsx("flex items-center gap-base mt-base", {
              ["opacity-50 pointer-events-none select-none"]: isEdit,
            })}
            tabIndex={isEdit ? -1 : 0}
          >
            <RadioGroup.Item
              value="percentage"
              className="flex-1"
              label="Percentage"
              description={"Discount applied in %"}
            />
            <RadioGroup.Item
              value="fixed"
              className="flex-1"
              label="Fixed amount"
              description={"Discount in whole numbers"}
            />
            <RadioGroup.Item
              value="free_shipping"
              className="flex-1"
              label="Free shipping"
              description={"Override delivery amount"}
            />
          </RadioGroup.Root>
        )
      }}
    />
  )
}

export default PromotionType
