import { useAdminUpdateVariant } from "medusa-react"
import React, { useEffect, useState } from "react"
import BodyCard from "../../../../components/organisms/body-card"
import VariantGrid from "../../../../components/variant-grid/index"
import NewOption from "../../details/variants/option-edit"
import pick from "lodash/pick"

const formatVariant = (variant) => {
  const cleanVariant = pick(variant, [
    "title",
    "sku",
    "ean",
    "upc",
    "barcode",
    "hs_code",
    "inventory_quantity",
    "allow_backorder",
    "manage_inventory",
    "weight",
    "length",
    "height",
    "width",
    "origin_country",
    "mid_code",
    "material",
    "metadata",
    "prices",
    "options",
  ])

  return {
    ...cleanVariant,
    variant_id: variant.id,
    inventory_quantity: parseInt(variant.inventory_quantity, 10),
    prices: variant.prices.map((price) =>
      pick(price, ["amount", "currency_code", "region_id", "sale_amount"])
    ),
    options: variant.options.map((option) =>
      pick(option, ["option_id", "value"])
    ),
  }
}

const Variants = ({ product }) => {
  const [variants, setVariants] = useState([])
  const [showAddOption, setShowAddOption] = useState(false)
  const { mutate } = useAdminUpdateVariant(product.id)

  useEffect(() => {
    if (product?.variants) {
      const variants = product?.variants?.map((v) => ({
        ...v,
        options: v.options.map((o) => ({
          ...o,
          title: product.options.find((po) => po.id === o.option_id)?.title,
        })),
      }))

      setVariants(variants)
    }
  }, [product])

  return (
    <BodyCard
      title="Variants"
      subtitle="Add variations of this product. Offer your customers different options for price, color, format, size, shape, etc."
      forceDropdown={true}
      actionables={[
        {
          label: "Edit options",
          onClick: () => setShowAddOption(true),
          icon: null,
        },
      ]}
    >
      <div className="mt-large">
        <div className="mt-large mb-small"></div>
        {product?.variants && (
          <VariantGrid
            edit
            product={product}
            variants={variants}
            onChange={(variant) => mutate(formatVariant(variant))}
          />
        )}
      </div>
      {showAddOption && (
        <NewOption
          productId={product.id}
          options={product.options}
          onDismiss={() => setShowAddOption(false)}
        />
      )}
    </BodyCard>
  )
}

export default Variants
