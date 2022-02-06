import React, { useEffect, useState } from "react"
import BodyCard from "../../../../components/organisms/body-card"
import VariantGrid from "../../../../components/variant-grid"
import { useProductForm } from "../form/product-form-context"

const Variants = ({ product }) => {
  const { register } = useProductForm()

  const [showAddOption, setShowAddOption] = useState(false)
  const [editVariant, setEditVariant] = useState("")
  const [newVariant, setNewVariant] = useState("")
  const [editIndex, setEditIndex] = useState("")
  const [variants, setVariants] = useState([])

  const handleSubmit = (data) => {
    console.log(data)
  }

  console.log(product)
  const handleUpdateVariant = (data) => {
    const updatedVariants = variants.slice()
    updatedVariants[editIndex] = { id: editVariant.id, ...data }
    setVariants(updatedVariants)
    setNewVariant(null)
    setEditVariant(null)
    handleSubmit(updatedVariants)
  }

  const handleCreateVariant = (data) => {
    const variant = { ...newVariant, ...data }
    delete variant.id
    const newVariants = [...variants, variant]
    setVariants(newVariants)
    setNewVariant(null)
    setEditVariant(null)
    handleSubmit(newVariants)
  }

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
      subtitle="Add variations of this product. Offer your customers different
options for price, color, format, size, shape, etc."
      forceDropdown={true}
      actionables={[
        {
          label: "Add option",
          onClick: () =>
            setNewVariant({
              options: product?.options.map((o) => ({
                value: "",
                name: o.title,
                option_id: o.id,
              })),
              prices: [],
            }),
          icon: null,
        },
      ]}
    >
      <div className="mt-large">
        <div className="mt-large mb-small"></div>
        {product?.variants && (
          <VariantGrid
            edit
            onEdit={(index) => {
              setEditVariant(variants[index])
              setEditIndex(index)
            }}
            onCopy={(index) => {
              setNewVariant(variants[index])
            }}
            product={product}
            variants={variants}
            onChange={(vs) => setVariants(vs)}
          />
        )}
      </div>
    </BodyCard>
  )
}

export default Variants
