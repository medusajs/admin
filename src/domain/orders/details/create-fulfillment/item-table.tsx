import { LineItem } from "@medusajs/medusa"
import { useAdminVariantsInventory } from "medusa-react"
import React, { useMemo } from "react"
import FeatureToggle from "../../../../components/fundamentals/feature-toggle"
import ImagePlaceholder from "../../../../components/fundamentals/image-placeholder"
import InputField from "../../../../components/molecules/input"

export const getFulfillableQuantity = (item: LineItem): number => {
  return item.quantity - item.fulfilled_quantity - item.returned_quantity
}

const CreateFulfillmentItemsTable = ({
  items,
  quantities,
  setQuantities,
  locationId,
  setErrors,
}) => {
  const handleQuantityUpdate = (value, id) => {
    let newQuantities = { ...quantities }

    newQuantities = {
      ...newQuantities,
      [id]: value,
    }

    setQuantities(newQuantities)
  }

  return (
    <div>
      {items.map((item, idx) => {
        return (
          <FulfillmentLine
            item={item}
            locationId={locationId}
            key={`fulfillmentLine-${idx}`}
            quantities={quantities}
            handleQuantityUpdate={handleQuantityUpdate}
            setErrors={setErrors}
          />
        )
      })}
    </div>
  )
}

const FulfillmentLine = ({
  item,
  locationId,
  quantities,
  handleQuantityUpdate,
  setErrors,
}: {
  locationId: string
  item: LineItem
  quantities: Record<string, number>
  handleQuantityUpdate: (value: number, id: string) => void
  setErrors: (errors: Record<string, string>) => void
}) => {
  const { variant, isLoading } = useAdminVariantsInventory(
    item.variant_id as string
  )

  const { availableQuantity, inStockQuantity } = useMemo(() => {
    if (isLoading || !locationId || !variant) {
      return {}
    }

    const { inventory } = variant

    const locationInventory = inventory[0].location_levels?.find(
      (inv) => inv.location_id === locationId
    )

    if (!locationInventory) {
      return {}
    }

    return {
      availableQuantity: locationInventory.available_quantity,
      inStockQuantity: locationInventory.stocked_quantity,
    }
  }, [variant, locationId, isLoading])

  const validQuantity =
    !locationId || (locationId && quantities[item.id] < availableQuantity)

  React.useEffect(() => {
    setErrors((errors) => {
      const newErrors = { ...errors }
      if (validQuantity) {
        delete newErrors[item.id]
        return newErrors
      } else {
        newErrors[item.id] = "Quantity is not valid"
        return newErrors
      }
    })
  }, [validQuantity, setErrors, item.id])

  return (
    <div className="mx-[-5px] mb-1 flex h-[64px] justify-between rounded-rounded py-2 px-[5px] hover:bg-grey-5">
      <div className="flex justify-center space-x-4">
        <div className="flex h-[48px] w-[36px] overflow-hidden rounded-rounded">
          {item.thumbnail ? (
            <img src={item.thumbnail} className="object-cover" />
          ) : (
            <ImagePlaceholder />
          )}
        </div>
        <div className="flex max-w-[185px] flex-col justify-center">
          <span className="inter-small-regular truncate text-grey-90">
            {item.title}
          </span>
          {item?.variant && (
            <span className="inter-small-regular truncate text-grey-50">
              {`${item.variant.title}${
                item.variant.sku ? ` (${item.variant.sku})` : ""
              }`}
            </span>
          )}
        </div>
      </div>
      <div className="flex  items-center">
        <FeatureToggle featureFlag="inventoryService">
          <div className="inter-base-regular mr-6 flex flex-col items-end whitespace-nowrap text-grey-50">
            <p>{availableQuantity || "N/A"} available</p>
            <p>({inStockQuantity || "N/A"} in stock)</p>
          </div>
        </FeatureToggle>
        <InputField
          type="number"
          name={`quantity`}
          defaultValue={getFulfillableQuantity(item)}
          min={0}
          suffix={
            <span className="flex">
              {"/"}
              <span className="pl-1">{getFulfillableQuantity(item)}</span>
            </span>
          }
          value={quantities[item.id]}
          max={getFulfillableQuantity(item)}
          onChange={(e) =>
            handleQuantityUpdate(e.target.valueAsNumber, item.id)
          }
          errors={validQuantity ? undefined : { quantity: "Invalid quantity" }}
        />
      </div>
    </div>
  )
}

export default CreateFulfillmentItemsTable
