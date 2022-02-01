import React, { useEffect, useState } from "react"
import { Box, Flex } from "rebass"
import Button from "../../../../components/button"
import Card from "../../../../components/card"
import Spinner from "../../../../components/spinner"
import VariantGrid from "../../../../components/variant-grid"
import NewOption from "./option-edit"
import VariantEditor from "./variant-editor"
import { getErrorMessage } from "../../../../utils/error-messages"

const Variants = ({
  product,
  isLoading,
  variantMethods,
  optionMethods,
  onSubmit,
}) => {
  const [showAddOption, setShowAddOption] = useState(false)
  const [editVariant, setEditVariant] = useState("")
  const [newVariant, setNewVariant] = useState("")
  const [editIndex, setEditIndex] = useState("")
  const [variants, setVariants] = useState([])

  useEffect(() => {
    if (isLoading) {
      return
    }

    const variants = product.variants.map((v) => ({
      ...v,
      options: v.options.map((o) => ({
        ...o,
        title: product.options.find((po) => po.id === o.option_id).title,
      })),
    }))

    setVariants(variants)
  }, [product, isLoading])

  const dropdownOptions = [
    {
      label: "Add variant",
      onClick: () =>
        setNewVariant({
          options: product.options.map((o) => ({
            value: "",
            name: o.title,
            option_id: o.id,
          })),
          prices: [],
        }),
    },
    {
      label: "Edit options...",
      onClick: () => {
        setShowAddOption(true)
      },
    },
  ]

  const handleSubmit = (variants) => {
    const payload = variants.map((v) => {
      let cleanPrices = v.prices.map((rawPrice) => {
        if (typeof rawPrice.amount === "undefined" || rawPrice.amount === "") {
          return null
        }

        const p = {
          amount: parseFloat(rawPrice.amount),
          currency_code: rawPrice.region_id
            ? undefined
            : rawPrice.currency_code,
        }

        if (rawPrice.region_id) {
          p.region_id = rawPrice.region_id
        }

        if (
          typeof rawPrice.sale_amount !== "undefined" &&
          rawPrice.sale_price !== ""
        ) {
          const amount = parseFloat(rawPrice.sale_amount)
          if (!isNaN(amount)) {
            p.sale_amount = amount
          }
        }

        return p
      })
      cleanPrices = cleanPrices.filter(Boolean)

      return {
        id: v.id,
        title: v.title,
        sku: v.sku || undefined,
        ean: v.ean || undefined,
        upc: v.upc || undefined,
        prices: cleanPrices,
        inventory_quantity: parseInt(v.inventory_quantity),
        options: v.options.map((o) => ({
          value: o.value,
          option_id: o.option_id,
        })),
        allow_backorder: v.allow_backorder,
        manage_inventory: v.manage_inventory,
        weight: v.weight,
        length: v.length,
        height: v.height,
        hs_code: v.hs_code,
        width: v.width,
        origin_country: v.origin_country,
        mid_code: v.mid_code,
        material: v.material,
      }
    })

    onSubmit({ variants: payload })
  }

  const handleVariantEdited = (data) => {
    const newVs = [...variants]
    newVs[editIndex] = {
      ...newVs[editIndex],
      ...data,
    }

    setVariants(newVs)
    setEditVariant(null)
  }

  const handleDeleteVariant = () => {
    variantMethods.delete(editVariant.id)
    setEditVariant(null)
  }

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

  return (
    <>
      <Card>
        <Card.Header dropdownOptions={dropdownOptions}>Variants</Card.Header>
        <Card.Body px={3}>
          {isLoading ? (
            <Flex flexDirection="column" alignItems="center" mt="auto" ml="50%">
              <Box height="75px" width="75px">
                <Spinner dark />
              </Box>
            </Flex>
          ) : (
            <Flex width={1} flexDirection={"column"}>
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
            </Flex>
          )}
        </Card.Body>
      </Card>
      {showAddOption && (
        <NewOption
          optionMethods={optionMethods}
          options={product.options}
          onClick={() => setShowAddOption(null)}
        />
      )}
      {(editVariant || newVariant) && (
        <VariantEditor
          variant={newVariant || editVariant}
          isCopy={!!newVariant}
          options={product.options}
          onDelete={handleDeleteVariant}
          onSubmit={(data) => {
            if (newVariant) {
              handleCreateVariant(data)
            } else if (editVariant) {
              handleUpdateVariant(data)
            }
          }}
          onCancel={() => {
            setEditVariant(null)
            setNewVariant(null)
          }}
        />
      )}
    </>
  )
}

export default Variants
