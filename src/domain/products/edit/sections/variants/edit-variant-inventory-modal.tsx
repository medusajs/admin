import { Product, ProductVariant } from "@medusajs/medusa"
import { useAdminVariantInventory } from "medusa-react"
import React, { useContext } from "react"
import { useForm } from "react-hook-form"
import Button from "../../../../../components/fundamentals/button"
import Modal from "../../../../../components/molecules/modal"
import LayeredModal, {
  LayeredModalContext,
} from "../../../../../components/molecules/modal/layered-modal"
import { countries } from "../../../../../utils/countries"
import EditFlowVariantForm, {
  EditFlowVariantFormType,
} from "../../../components/variant-inventory-form/edit-flow-variant-form"
import useEditProductActions from "../../hooks/use-edit-product-actions"
import { createUpdatePayload } from "./edit-variants-modal/edit-variant-screen"

type Props = {
  onClose: () => void
  product: Product
  variant: ProductVariant
  isDuplicate?: boolean
}

const EditVariantInventoryModal = ({ onClose, product, variant }: Props) => {
  const layeredModalContext = useContext(LayeredModalContext)
  const {
    variant: variantInventory,
    isLoading: isLoadingInventory,
    refetch
  } = useAdminVariantInventory(variant.id)

  const handleClose = () => {
    onClose()
  }

  const { onUpdateVariant, updatingVariant } = useEditProductActions(product.id)

  const onSubmit = (data) => {
    // @ts-ignore
    onUpdateVariant(variant.id, createUpdatePayload(data), handleClose)
  }

  return (
    <LayeredModal context={layeredModalContext} handleClose={handleClose}>
      <Modal.Header handleClose={handleClose}>
        <h1 className="inter-xlarge-semibold">
          Manage inventory
          {variant.title && (
            <span className="text-grey-50 inter-xlarge-regular">
              {" "}
              ({variant.title})
            </span>
          )}
        </h1>
      </Modal.Header>
      {!isLoadingInventory && (
        <StockForm
          variantInventory={variantInventory}
          refetchInventory={refetch}
          onSubmit={onSubmit}
          isLoadingInventory={isLoadingInventory}
          handleClose={handleClose}
          updatingVariant={updatingVariant}
        />
      )}
    </LayeredModal>
  )
}

const StockForm = ({
  variantInventory,
  onSubmit,
  refetchInventory,
  isLoadingInventory,
  handleClose,
  updatingVariant,
}) => {
  const form = useForm<EditFlowVariantFormType>({
    defaultValues: getEditVariantDefaultValues(variantInventory),
  })

  const {
    formState: { isDirty },
    handleSubmit,
    reset,
  } = form

  const handleOnSubmit = handleSubmit((data) => {
    // @ts-ignore
    onSubmit(data)
  })

  const itemId = variantInventory.inventory[0].id
  const locationLevels = variantInventory.inventory[0].location_levels

  return (
    <form onSubmit={handleOnSubmit} noValidate>
      <Modal.Content>
        <EditFlowVariantForm
          form={form}
          refetchInventory={refetchInventory}
          locationLevels={locationLevels}
          itemId={itemId}
        />
      </Modal.Content>
      <Modal.Footer>
        <div className="w-full flex items-center gap-x-xsmall justify-end">
          <Button
            variant="secondary"
            size="small"
            type="button"
            onClick={() => {
              reset(getEditVariantDefaultValues(variantInventory))
              handleClose()
            }}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            size="small"
            type="submit"
            disabled={!isDirty}
            loading={updatingVariant}
          >
            Save and close
          </Button>
        </div>
      </Modal.Footer>
    </form>
  )
}

export const getEditVariantDefaultValues = (
  variantInventory?: any
): EditFlowVariantFormType => {
  const inventoryItem = variantInventory?.inventory[0]

  if (!inventoryItem) {
    return {
      stock: {
        sku: null,
        ean: null,
        inventory_quantity: null,
        manage_inventory: false,
        allow_backorder: false,
        barcode: null,
        upc: null,
      },
      customs: {
        hs_code: null,
        mid_code: null,
        origin_country: null,
      },
      dimensions: {
        weight: null,
        width: null,
        height: null,
        length: null,
      },
    }
  }

  const country = countries.find(
    (country) =>
      country.name.toLowerCase() === inventoryItem.origin_country?.toLowerCase()
  )

  const countryOption = country
    ? { label: country.name, value: country.alpha2 }
    : null

  return {
    stock: {
      sku: inventoryItem.sku,
      ean: inventoryItem.ean,
      inventory_quantity: inventoryItem.inventory_quantity,
      manage_inventory: !!inventoryItem,
      allow_backorder: inventoryItem.allow_backorder,
      barcode: inventoryItem.barcode,
      upc: inventoryItem.upc,
    },
    customs: {
      hs_code: inventoryItem.hs_code,
      mid_code: inventoryItem.mid_code,
      origin_country: countryOption,
    },
    dimensions: {
      weight: inventoryItem.weight,
      width: inventoryItem.width,
      height: inventoryItem.height,
      length: inventoryItem.length,
    },
  }
}

export default EditVariantInventoryModal
