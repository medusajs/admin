import React, { useEffect, useState } from "react"
import { Box, Flex } from "rebass"
import Button from "../../../../components/button"
import Card from "../../../../components/card"
import Spinner from "../../../../components/spinner"
import VariantGrid from "../../../../components/variant-grid"
import NewOption from "./option-edit"
import VariantEditor from "./variant-editor"

const Variants = ({
  product,
  isLoading,
  variantMethods,
  optionMethods,
  onSubmit,
}) => {
  const [showAddOption, setShowAddOption] = useState(false)
  const [editVariant, setEditVariant] = useState("")
  const [editIndex, setEditIndex] = useState("")
  const [variants, setVariants] = useState([])
  const [saveButtonDisabled, setSaveButtonDisabled] = useState(true)

  useEffect(() => {
    if (isLoading) return

    const variants = product.variants.map(v => ({
      ...v,
      options: v.options.map(o => ({
        ...o,
        title: product.options.find(po => po._id === o.option_id).title,
      })),
    }))

    setVariants(variants)
  }, [product, isLoading])

  const dropdownOptions = [
    {
      label: "Add variant",
      onClick: () =>
        setVariants([
          ...variants,
          {
            options: product.options.map(o => ({
              value: "",
              name: o.title,
              option_id: o._id,
            })),
            prices: [],
          },
        ]),
    },
    {
      label: "Edit options...",
      onClick: () => {
        setShowAddOption(true)
      },
    },
  ]

  const handleSubmit = e => {
    e.preventDefault()

    const payload = variants.map(v => {
      let cleanPrices = v.prices.map(rawPrice => {
        if (typeof rawPrice.amount === "undefined" || rawPrice.amount === "") {
          return null
        }

        const p = {
          amount: parseFloat(rawPrice.amount),
          currency_code: rawPrice.region_id
            ? undefined
            : rawPrice.currency_code,
          region_id: rawPrice.region_id,
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
        _id: v._id,
        title: v.title,
        sku: v.sku || undefined,
        ean: v.ean || undefined,
        prices: cleanPrices,
        inventory_quantity: v.inventory_quantity,
        options: v.options.map(o => ({
          value: o.value,
          option_id: o.option_id,
        })),
      }
    })

    onSubmit({ variants: payload })
    setSaveButtonDisabled(true)
  }

  const handleVariantEdited = data => {
    const newVs = [...variants]
    newVs[editIndex] = {
      ...newVs[editIndex],
      ...data,
    }

    setSaveButtonDisabled(false)
    setVariants(newVs)
    setEditVariant(null)
  }

  const handleDeleteVariant = () => {
    variantMethods.delete(editVariant._id)
    setEditVariant(null)
  }

  const handleCreateOption = data => {
    optionMethods.create(data)
  }

  const handleChange = vs => {
    setVariants(vs)
    setSaveButtonDisabled(false)
  }

  return (
    <>
      <Card as="form" onSubmit={handleSubmit} mb={2}>
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
                onEdit={index => {
                  setEditVariant(variants[index])
                  setEditIndex(index)
                }}
                product={product}
                variants={variants}
                onChange={vs => handleChange(vs)}
              />
            </Flex>
          )}
        </Card.Body>
        <Card.Footer px={3} justifyContent="flex-end">
          <Button variant={"cta"} type="submit" disabled={saveButtonDisabled}>
            Save
          </Button>
        </Card.Footer>
      </Card>
      {showAddOption && (
        <NewOption
          optionMethods={optionMethods}
          options={product.options}
          onClick={() => setShowAddOption(null)}
        />
      )}
      {editVariant && (
        <VariantEditor
          variant={editVariant}
          options={product.options}
          onDelete={handleDeleteVariant}
          onSubmit={data => handleVariantEdited(data)}
          onClick={() => setEditVariant(null)}
        />
      )}
    </>
  )
}

export default Variants
