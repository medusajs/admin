import React, { useEffect, useState } from "react"
import BodyCard from "../../../../components/organisms/body-card"
import VariantGrid from "../../../../components/variant-grid"

const Variants = ({ product }) => {
  const [variants, setVariants] = useState([])

  useEffect(() => {
    if (product?.variants) {
      const variants = product?.variants?.map((v) => ({
        ...v,
        options: v.options.map((o) => ({
          ...o,
          title: product.options.find((po) => po.id === o.option_id).title,
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
          label: "Add option",
          onClick: () => console.log("TODO"),
          icon: null,
        },
      ]}
    >
      <div className="mt-large">
        <div className="mt-large mb-small"></div>
        {product?.variants && (
          <VariantGrid edit product={product} variants={variants} />
        )}
      </div>
    </BodyCard>
  )
}

export default Variants
