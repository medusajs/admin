import React from "react"
import Checkbox from "../../../../components/atoms/checkbox"
import InfoTooltip from "../../../../components/molecules/info-tooltip"
import Input from "../../../../components/molecules/input"
import BodyCard from "../../../../components/organisms/body-card"
import { useProductForm } from "../form/product-form-context"

const StockAndInventory = () => {
  const { isVariantsView, register } = useProductForm()
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
                name="sku"
                placeholder="SUN-G, JK1234..."
                ref={register}
              />
              <Input
                label="Barcode (EAN)"
                name="ean"
                placeholder="1231231231234..."
                ref={register}
              />
              <Input
                label="Quantity in stock"
                name="inventory_quantity"
                type="number"
                placeholder="100"
                ref={register}
              />
            </div>
          </>
        )}
        {!isVariantsView && (
          <div className="flex items-center gap-4 mb-xlarge">
            <div className="flex item-center gap-x-1.5">
              <Checkbox
                name="manage_inventory"
                label="Manage Inventory"
                ref={register}
              />
              <InfoTooltip
                content={
                  "When checked Medusa will regulate the inventory when orders and returns are made."
                }
              />
            </div>
            <div className="flex item-center gap-x-1.5">
              <Checkbox
                name="allow_backorder"
                ref={register}
                label="Allow backorders"
              />
              <InfoTooltip
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
              name="height"
              ref={register}
              placeholder="100..."
            />
            <Input
              type="number"
              label="Width"
              name="width"
              ref={register}
              placeholder="100..."
            />
            <Input
              type="number"
              label="Length"
              name="length"
              ref={register}
              placeholder="100..."
            />
            <Input
              type="number"
              label="Weight"
              name="weight"
              ref={register}
              placeholder="100..."
            />
          </div>
          <div className="flex-1 grid grid-cols-2 gap-x-2 gap-y-4 mb-large">
            <Input
              label="MID Code"
              name="mid_code"
              ref={register}
              placeholder="100..."
            />
            <Input
              label="HS Code"
              name="hs_code"
              ref={register}
              placeholder="100..."
            />
            <Input
              ref={register}
              label="Country of origin"
              name="origin_country"
              placeholder="Denmark..."
            />
            <Input
              label="Material"
              name="material"
              ref={register}
              placeholder="Wool..."
            />
          </div>
        </div>
      </div>
    </BodyCard>
  )
}

export default StockAndInventory
