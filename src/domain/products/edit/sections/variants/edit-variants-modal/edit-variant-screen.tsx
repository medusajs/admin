import { Product, ProductVariant } from "@medusajs/medusa"
import { useAdminProduct } from "medusa-react"
import React, { useContext, useEffect, useMemo } from "react"
import { useForm } from "react-hook-form"
import Button from "../../../../../../components/fundamentals/button"
import Modal from "../../../../../../components/molecules/modal"
import { LayeredModalContext } from "../../../../../../components/molecules/modal/layered-modal"
import { countries } from "../../../../../../utils/countries"
import VariantForm, {
  VariantFormType,
} from "../../../../components/variant-form"
import useEditProductActions from "../../../hooks/use-edit-product-actions"

type Props = {
  variant: ProductVariant
  product: Product
}

const EditVariantScreen = ({ variant, product }: Props) => {
  const form = useForm<VariantFormType>({
    defaultValues: getDefaultValues(variant, product),
  })

  const { product: altProduct, status } = useAdminProduct(product.id)

  const { pop } = useContext(LayeredModalContext)
  const { updatingVariant, onUpdateVariant } = useEditProductActions(product.id)

  const popAndReset = () => {
    form.reset(getDefaultValues(variant, product))
    pop()
  }

  useEffect(() => {
    form.reset(getDefaultValues(variant, product))
  }, [variant, product])

  const createPayload = (data: VariantFormType) => {
    const { customs, dimensions, prices, options, ...rest } = data

    return {
      ...rest,
      ...customs,
      origin_country: customs.origin_country
        ? customs.origin_country.value
        : null,
      prices: prices.prices.map((price) => ({
        id: price.id,
        amount: price.amount,
      })),
      options: options.map((option) => ({
        option_id: option.id,
        value: option.value,
      })),
      ...dimensions,
    }
  }

  const onSubmitAndBack = form.handleSubmit((data) => {
    // @ts-ignore
    onUpdateVariant(variant.id, createPayload(data), popAndReset)
  })

  const onSubmitAndClose = form.handleSubmit((data) => {})

  return (
    <>
      <form>
        <Modal.Content>
          <VariantForm form={form} />
        </Modal.Content>
        <Modal.Footer>
          <div className="flex items-center w-full justify-end gap-x-xsmall">
            <Button variant="secondary" size="small" type="button">
              Cancel
            </Button>
            <Button
              variant="primary"
              size="small"
              type="button"
              disabled={updatingVariant || !form.formState.isDirty}
              loading={updatingVariant}
              onClick={onSubmitAndBack}
            >
              Save and go back
            </Button>
            <Button
              variant="primary"
              size="small"
              type="button"
              disabled={updatingVariant || !form.formState.isDirty}
              loading={updatingVariant}
            >
              Save and close
            </Button>
          </div>
        </Modal.Footer>
      </form>
    </>
  )
}

const getDefaultValues = (
  variant: ProductVariant,
  product: Product
): VariantFormType => {
  const options = product.options.map((option) => ({
    title: option.title,
    id: option.id,
    value:
      variant.options.find((optionValue) => optionValue.option_id === option.id)
        ?.value || "",
  }))

  const country = countries.find(
    (country) =>
      country.name.toLowerCase() === variant.origin_country?.toLowerCase()
  )

  const countryOption = country
    ? { label: country.name, value: country.alpha2 }
    : null

  return {
    title: variant.title,
    sku: variant.sku,
    ean: variant.ean,
    inventory_quantity: variant.inventory_quantity,
    material: variant.material,
    manage_inventory: variant.manage_inventory,
    allow_backorder: variant.allow_backorder,
    barcode: variant.barcode,
    upc: variant.upc,
    customs: {
      hs_code: variant.hs_code,
      mid_code: variant.mid_code,
      origin_country: countryOption,
    },
    options,
    prices: {
      prices: variant.prices.map((price) => ({
        id: price.id,
        amount: price.amount,
        currency_code: price.currency_code,
        region_id: price.region_id,
      })),
    },
    dimensions: {
      weight: variant.weight,
      width: variant.width,
      height: variant.height,
      length: variant.length,
    },
  }
}

export const useEditVariantScreen = (props: Props) => {
  const { pop } = React.useContext(LayeredModalContext)

  const screen = useMemo(() => {
    console.log("Detected change in useEditVariantScreen")
    return {
      title: "Edit Variant",
      subtitle: props.variant.title,
      onBack: pop,
      view: <EditVariantScreen {...props} />,
    }
  }, [props])

  return screen
}

export default EditVariantScreen
