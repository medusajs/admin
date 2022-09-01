import { AdminPostProductsProductVariantsReq, Product } from "@medusajs/medusa"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import Button from "../../../../../components/fundamentals/button"
import Modal from "../../../../../components/molecules/modal"
import EditFlowVariantForm, {
  EditFlowVariantFormType,
} from "../../../components/variant-form/edit-flow-variant-form"
import useEditProductActions from "../../hooks/use-edit-product-actions"

type Props = {
  onClose: () => void
  open: boolean
  product: Product
}

const AddVariantModal = ({ open, onClose, product }: Props) => {
  const form = useForm<EditFlowVariantFormType>({
    defaultValues: getDefaultValues(product),
  })

  const { onAddVariant, addingVariant } = useEditProductActions(product.id)

  const { handleSubmit, reset } = form

  useEffect(() => {
    reset(getDefaultValues(product))
  }, [product])

  const resetAndClose = () => {
    reset(getDefaultValues(product))
    onClose()
  }

  const onSubmit = handleSubmit((data) => {
    onAddVariant(createAddPayload(data), resetAndClose)
  })

  return (
    <Modal open={open} handleClose={resetAndClose}>
      <Modal.Body>
        <Modal.Header handleClose={resetAndClose}>
          <h1 className="inter-xlarge-semibold">Add Variant</h1>
        </Modal.Header>
        <form onSubmit={onSubmit}>
          <Modal.Content>
            <EditFlowVariantForm form={form} />
          </Modal.Content>
          <Modal.Footer>
            <div className="flex items-center gap-x-xsmall justify-end w-full">
              <Button
                variant="secondary"
                size="small"
                type="button"
                onClick={resetAndClose}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="small"
                type="submit"
                loading={addingVariant}
              >
                Save and close
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

const getDefaultValues = (product: Product): EditFlowVariantFormType => {
  const options = product.options.map((option) => ({
    title: option.title,
    id: option.id,
    value: "",
  }))

  return {
    general: {
      title: null,
      material: null,
    },
    stock: {
      sku: null,
      ean: null,
      upc: null,
      barcode: null,
      inventory_quantity: null,
      manage_inventory: false,
      allow_backorder: false,
    },
    options: options,
    prices: {
      prices: [],
    },
    dimensions: {
      weight: null,
      width: null,
      height: null,
      length: null,
    },
    customs: {
      mid_code: null,
      hs_code: null,
      origin_country: null,
    },
  }
}

export const createAddPayload = (
  data: EditFlowVariantFormType
): AdminPostProductsProductVariantsReq => {
  return {
    sku: data.stock.sku || undefined,
    upc: data.stock.upc || undefined,
    barcode: data.stock.barcode || undefined,
    ean: data.stock.ean || undefined,
    weight: data.dimensions.weight || undefined,
    width: data.dimensions.width || undefined,
    height: data.dimensions.height || undefined,
    length: data.dimensions.length || undefined,
    mid_code: data.customs.mid_code || undefined,
    origin_country: data.customs.origin_country?.value || undefined,
    allow_backorder: data.stock.allow_backorder,
    manage_inventory: data.stock.manage_inventory,
    material: data.general.material || undefined,
    inventory_quantity: data.stock.inventory_quantity || 0,
    prices: data.prices.prices.map((p) => ({
      amount: p.amount || 0,
      currency_code: p.region_id ? undefined : p.currency_code,
      region_id: p.region_id || undefined,
    })),
    title:
      data.general.title || `${data.options?.map((o) => o.value).join(" / ")}`,
    options: data.options.map((option) => ({
      option_id: option.id,
      value: option.value,
    })),
  }
}

export default AddVariantModal
