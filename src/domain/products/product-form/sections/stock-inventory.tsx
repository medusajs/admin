import React from "react"
import { Controller } from "react-hook-form"
import Checkbox from "../../../../components/atoms/checkbox"
import IconTooltip from "../../../../components/molecules/icon-tooltip"
import Input from "../../../../components/molecules/input"
import Select from "../../../../components/molecules/select"
import BodyCard from "../../../../components/organisms/body-card"
import { countries as countryData } from "../../../../utils/countries"
import { numberOrNull } from "../../../../utils/form-helpers"
import { useProductForm } from "../form/product-form-context"

const StockAndInventory = () => {
  const {
    isVariantsView,
    form: { register, control },
  } = useProductForm()
  const countryOptions = countryData.map((c) => ({
    label: c.name,
    value: c.name,
  }))

  return (
    <BodyCard
      title="Stock & Inventory"
      subtitle="To start selling, all you need is a name, price, and image"
    >
      <div className="mt-large">
        {!isVariantsView && (
          <>
            <div className="flex items-center mb-base">
              <h6 className="inter-base-semibold text-grey-90 mr-1.5">
                General
              </h6>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-4 mb-large">
              <Input
                label="Stock Keeping Unit (SKU)"
                placeholder="SUN-G, JK1234..."
                {...register("sku")}
              />
              <Input
                label="Barcode (EAN)"
                placeholder="1231231231234..."
                {...register("ean")}
              />
              <Input
                label="Quantity in stock"
                type="number"
                placeholder="100"
                {...register("inventory_quantity", {
                  setValueAs: numberOrNull,
                })}
              />
              <Input
                label="Material"
                {...register("material")}
                placeholder="Wool..."
              />
            </div>
          </>
        )}
        {!isVariantsView && (
          <div className="flex items-center gap-4 mb-xlarge">
            <div className="flex item-center gap-x-1.5">
              <Checkbox
                label="Manage Inventory"
                {...register("manage_inventory")}
              />
              <IconTooltip
                content={
                  "When checked Medusa will regulate the inventory when orders and returns are made."
                }
              />
            </div>
            <div className="flex item-center gap-x-1.5">
              <Checkbox
                {...register("allow_backorder")}
                label="Allow backorders"
              />
              <IconTooltip
                content={
                  "When checked the product will be available for purchase despite the product being sold out."
                }
              />
            </div>
          </div>
        )}
        <div className="flex items-center mb-base">
          <h6 className="inter-base-semibold text-grey-90 mr-1.5">
            Dimensions
          </h6>
        </div>
        <div className="flex gap-x-8">
          <div className="flex-1 grid grid-cols-2 gap-x-2 gap-y-4 mb-large">
            <Input
              type="number"
              label="Height"
              {...register("height", { setValueAs: numberOrNull })}
              min={0}
              placeholder="100..."
            />
            <Input
              type="number"
              label="Width"
              {...register("width", { setValueAs: numberOrNull })}
              placeholder="100..."
              min={0}
            />
            <Input
              type="number"
              label="Length"
              {...register("length", { setValueAs: numberOrNull })}
              placeholder="100..."
              min={0}
            />
            <Input
              type="number"
              label="Weight"
              {...register("weight", { setValueAs: numberOrNull })}
              placeholder="100..."
              min={0}
            />
          </div>
          <div className="flex-1 grid grid-cols-2 gap-x-2 gap-y-4 mb-large">
            <Input
              label="MID Code"
              {...register("mid_code")}
              placeholder="100..."
            />
            <Input
              label="HS Code"
              {...register("hs_code")}
              placeholder="100..."
            />
            <Controller
              control={control}
              name="origin_country"
              render={({ field: { onChange, value } }) => {
                return (
                  <Select
                    enableSearch
                    label="Country of origin"
                    placeholder="Select a country"
                    options={countryOptions}
                    value={value}
                    onChange={onChange}
                  />
                )
              }}
            />
          </div>
        </div>
      </div>
    </BodyCard>
  )
}

export default StockAndInventory
