import { Product } from "@medusajs/medusa"
import React from "react"
import { useForm } from "react-hook-form"
import Button from "../../../../../components/fundamentals/button"
import Modal from "../../../../../components/molecules/modal"
import VariantForm, { VariantFormType } from "../../../components/variant-form"
import useEditProductActions from "../../hooks/use-edit-product-actions"

type Props = {
  onClose: () => void
  open: boolean
  product: Product
}

const AddVariantModal = ({ open, onClose, product }: Props) => {
  const form = useForm<VariantFormType>({
    defaultValues: getDefaultValues(product),
  })

  const { onAddVariant, addingVariant } = useEditProductActions(product.id)

  const { handleSubmit } = form

  const onSubmit = handleSubmit((data) => {
    onAddVariant(
      {
        sku: data.sku || undefined,
        upc: data.upc || undefined,
        barcode: data.barcode || undefined,
        ean: data.ean || undefined,
        weight: data.dimensions.weight || undefined,
        width: data.dimensions.width || undefined,
        height: data.dimensions.height || undefined,
        length: data.dimensions.length || undefined,
        mid_code: data.customs.mid_code || undefined,
        allow_backorder: data.allow_backorder,
        manage_inventory: data.manage_inventory,
        material: data.material || undefined,
        inventory_quantity: data.inventory_quantity || 0,
        prices: data.prices.prices.map((p) => ({
          amount: p.amount || 0,
          currency_code: p.region_id ? undefined : p.currency_code,
          region_id: p.region_id || undefined,
        })),
        title: data.title || `${data.options?.map((o) => o.value).join(" / ")}`,
        options: data.options.map((option) => ({
          option_id: option.id,
          value: option.value,
        })),
      },
      () => {}
    )
  })

  return (
    <Modal open={open} handleClose={onClose}>
      <Modal.Body>
        <Modal.Header handleClose={onClose}>
          <h1 className="inter-xlarge-semibold">Add Variant</h1>
        </Modal.Header>
        <form>
          <Modal.Content>
            <VariantForm form={form} />
          </Modal.Content>
          <Modal.Footer>
            <div className="flex items-center gap-x-xsmall justify-end w-full">
              <Button variant="secondary" size="small" type="button">
                Cancel
              </Button>
              <Button variant="primary" size="small" type="submit">
                Save and close
              </Button>
            </div>
          </Modal.Footer>
        </form>
      </Modal.Body>
    </Modal>
  )
}

const getDefaultValues = (product: Product): VariantFormType | undefined => {
  const options = product.options.map((option) => ({
    title: option.title,
    id: option.id,
    value: "",
  }))

  return {
    title: null,
    sku: null,
    ean: null,
    upc: null,
    barcode: null,
    inventory_quantity: null,
    material: null,
    manage_inventory: false,
    allow_backorder: false,
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

export default AddVariantModal
