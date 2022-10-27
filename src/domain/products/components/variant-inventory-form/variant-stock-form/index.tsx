import React, { useMemo, useState, useContext } from "react"
import Modal from "../../../../../components/molecules/modal"
import { LayeredModalContext } from "../../../../../components/molecules/modal/layered-modal"
import {
  useAdminStockLocations,
  useAdminDeleteInventoryItemLocationLevel,
  useAdminCreateInventoryItemLocationLevel,
  useAdminUpdateInventoryItemLocationLevel,
} from "medusa-react"
import { InventoryLevelDTO, StockLocationDTO } from "@medusajs/medusa"
import { Controller } from "react-hook-form"
import Button from "../../../../../components/fundamentals/button"
import Switch from "../../../../../components/atoms/switch"
import InputField from "../../../../../components/molecules/input"
import { NestedForm } from "../../../../../utils/nested-form"

export type VariantStockFormType = {
  manage_inventory: boolean
  allow_backorder: boolean
  inventory_quantity: number | null
  sku: string | null
  ean: string | null
  upc: string | null
  barcode: string | null
}

type Props = {
  itemId: string
  locationLevels: {
    id: string
    location_id: string
    incoming_quantity: number
    stocked_quantity: number
    available_quantity: number
  }[]
  refetchInventory: () => void
  form: NestedForm<VariantStockFormType>
}

const VariantStockForm = ({
  form,
  locationLevels,
  refetchInventory,
  itemId,
}: Props) => {
  const layeredModalContext = useContext(LayeredModalContext)

  const { stock_locations: locations, isLoading } = useAdminStockLocations()

  const updateLevel = useAdminUpdateInventoryItemLocationLevel(itemId)
  const deleteLevel = useAdminDeleteInventoryItemLocationLevel(itemId)
  const createLevel = useAdminCreateInventoryItemLocationLevel(itemId)

  const {
    path,
    control,
    register,
    formState: { errors },
  } = form

  const handleUpdateInventory = async (value) => {
    const locationId = value.locationId
    const stockedQuantity = value.stockedQuantity

    await updateLevel.mutateAsync({
      locationId,
      stocked_quantity: stockedQuantity,
    })

    refetchInventory()
  }

  const handleUpdateLocations = async (value) => {
    await Promise.all(
      value.removed.map(async (id) => {
        await deleteLevel.mutateAsync(id)
      })
    )

    await Promise.all(
      value.added.map(async (id) => {
        await createLevel.mutateAsync({
          stocked_quantity: 0,
          location_id: id,
        })
      })
    )

    refetchInventory()
  }

  return (
    <div>
      <p className="inter-base-regular text-grey-50">
        Configure the inventory and stock for this variant.
      </p>
      <div className="pt-large flex flex-col gap-y-xlarge">
        <div className="flex flex-col gap-y-2xsmall">
          <div className="flex items-center justify-between">
            <h3 className="inter-base-semibold mb-2xsmall">Manage inventory</h3>
            <Controller
              control={control}
              name={path("manage_inventory")}
              render={({ field: { value, onChange } }) => {
                return <Switch checked={value} onCheckedChange={onChange} />
              }}
            />
          </div>
          <p className="inter-base-regular text-grey-50">
            When checked Medusa will regulate the inventory when orders and
            returns are made.
          </p>
        </div>
        <div className="flex flex-col gap-y-2xsmall">
          <div className="flex items-center justify-between">
            <h3 className="inter-base-semibold mb-2xsmall">Allow backorders</h3>
            <Controller
              control={control}
              name={path("allow_backorder")}
              render={({ field: { value, onChange } }) => {
                return <Switch checked={value} onCheckedChange={onChange} />
              }}
            />
          </div>
          <p className="inter-base-regular text-grey-50">
            When checked the product will be available for purchase despite the
            product being sold out
          </p>
        </div>
        <div className="flex w-full text-base">
          {!isLoading && locations && (
            <div className="flex flex-col w-full">
              <div className="flex py-3 font-bold border-y">
                <div className="flex-1 text-left">Location</div>
                <div className="flex-1 text-center">Incoming</div>
                <div className="flex-1 text-center">Committed</div>
                <div className="flex-1 text-center">Available</div>
                <div className="flex-1 text-left"></div>
              </div>
              {locationLevels.map((level) => {
                const locationDetails = locations.find(
                  (l) => l.id === level.location_id
                )

                return (
                  <div className="flex py-3 border-b items-center">
                    <div className="flex-1 font-bold">
                      {locationDetails!.name}
                    </div>
                    <div className="flex-1 text-center">
                      {level.incoming_quantity}
                    </div>
                    <div className="flex-1 text-center">
                      {level.stocked_quantity - level.available_quantity}
                    </div>
                    <div className="flex-1 text-center">
                      {level.available_quantity}
                    </div>
                    <div className="flex-1 flex justify-end">
                      <Button
                        variant="secondary"
                        size="small"
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()

                          layeredModalContext.push(
                            EditInventoryScreen(
                              layeredModalContext.pop,
                              level,
                              locationDetails,
                              handleUpdateInventory
                            )
                          )
                        }}
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
        <div className="flex">
          <Button
            variant="secondary"
            size="small"
            onClick={(e) => {
              e.preventDefault()

              layeredModalContext.push(
                ManageLocationsScreen(
                  layeredModalContext.pop,
                  locationLevels,
                  locations,
                  handleUpdateLocations
                )
              )
            }}
          >
            Manage locations
          </Button>
        </div>
        <div className="grid grid-cols-2 gap-large">
          <InputField
            label="Stock keeping unit (SKU)"
            placeholder="SUN-G, JK1234..."
            {...register(path("sku"))}
          />
          <InputField
            label="EAN (Barcode)"
            placeholder="123456789102..."
            {...register(path("ean"))}
          />
          <InputField
            label="UPC (Barcode)"
            placeholder="023456789104..."
            {...register(path("upc"))}
          />
          <InputField
            label="Barcode"
            placeholder="123456789104..."
            {...register(path("barcode"))}
          />
        </div>
      </div>
    </div>
  )
}

const EditInventoryScreen = (
  pop: () => void,
  level: InventoryLevelDTO,
  locationDetails: StockLocationDTO,
  onSubmit: (value: any) => void
) => {
  return {
    title: `Update ${locationDetails.name} inventory`,
    onBack: () => pop(),
    view: <EditInventoryForm level={level} onSubmit={onSubmit} />,
  }
}

const ManageLocationsScreen = (
  pop: () => void,
  levels: InventoryLevelDTO[],
  locations: StockLocationDTO[],
  onSubmit: (value: any) => Promise<void>
) => {
  return {
    title: "Manage locations",
    onBack: () => pop(),
    view: (
      <ManageLocationsForm
        existingLevels={levels}
        locationOptions={locations}
        onSubmit={onSubmit}
      />
    ),
  }
}

const EditInventoryForm = ({ level, onSubmit }) => {
  const layeredModalContext = useContext(LayeredModalContext)
  const { pop } = layeredModalContext

  const [stockedQuantity, setStockedQuantity] = useState(level.stocked_quantity)

  const handleSubmit = async (e) => {
    e.preventDefault()

    await onSubmit({
      locationId: level.location_id,
      stockedQuantity: parseInt(stockedQuantity),
    }).then(() => {
      pop()
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Modal.Content>
        <div className="flex items-center">
          <div className="flex-1">Stocked Quantity</div>
          <div>
            <InputField
              type="number"
              value={stockedQuantity}
              onChange={(e) => setStockedQuantity(e.target.value)}
            />
          </div>
        </div>
      </Modal.Content>
      <Modal.Footer>
        <div className="flex w-full justify-end gap-x-xsmall">
          <Button
            variant="ghost"
            size="small"
            className="w-[112px]"
            onClick={() => pop()}
            type="button"
          >
            Back
          </Button>
          <Button
            variant="primary"
            className="w-[112px]"
            size="small"
            type="submit"
          >
            Add
          </Button>
        </div>
      </Modal.Footer>
    </form>
  )
}

type ManageLocationFormProps = {
  existingLevels: InventoryLevelDTO[]
  locationOptions: StockLocationDTO[]
  onSubmit: (value: any) => Promise<void>
}

const ManageLocationsForm = ({
  existingLevels,
  locationOptions,
  onSubmit,
}: ManageLocationFormProps) => {
  const layeredModalContext = useContext(LayeredModalContext)
  const { pop } = layeredModalContext

  const existingLocations = useMemo(() => {
    return existingLevels.map((level) => level.location_id)
  }, [existingLevels])

  const [selectedLocations, setSelectedLocations] = useState<string[]>(
    existingLocations
  )

  const handleToggleLocation = (locationId: string) => {
    if (selectedLocations.includes(locationId)) {
      setSelectedLocations(selectedLocations.filter((id) => id !== locationId))
    } else {
      setSelectedLocations([...selectedLocations, locationId])
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const newLevels = selectedLocations.filter(
      (locationId: string) => !existingLocations.includes(locationId)
    )
    const removedLevels = existingLocations.filter(
      (locationId) => !selectedLocations.includes(locationId)
    )

    await onSubmit({
      added: newLevels,
      removed: removedLevels,
    }).then(() => {
      pop()
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <Modal.Content>
        <div>
          {locationOptions.map((loc) => {
            const existingLevel = selectedLocations.find((l) => l === loc.id)

            return (
              <div className="flex gap-6" key={loc.id}>
                <Switch
                  checked={!!existingLevel}
                  onCheckedChange={() => handleToggleLocation(loc.id)}
                />
                <h3>{loc.name}</h3>
              </div>
            )
          })}
        </div>
      </Modal.Content>
      <Modal.Footer>
        <div className="flex w-full justify-end gap-x-xsmall">
          <Button
            variant="ghost"
            size="small"
            className="w-[112px]"
            onClick={() => pop()}
            type="button"
          >
            Back
          </Button>
          <Button
            variant="primary"
            className="w-[112px]"
            size="small"
            type="submit"
          >
            Add
          </Button>
        </div>
      </Modal.Footer>
    </form>
  )
}

export default VariantStockForm
