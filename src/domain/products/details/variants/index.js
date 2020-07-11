import React, { useEffect, useState } from "react"
import { Text, Flex, Box } from "rebass"

import NewOption from "./option-edit"
import VariantEditor from "./variant-editor"
import VariantGrid from "../../../../components/variant-grid"
import Button from "../../../../components/button"
import Card from "../../../../components/card"
import Input from "../../../../components/input"
import TextArea from "../../../../components/textarea"
import Spinner from "../../../../components/spinner"

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

    const payload = variants.map(v => ({
      _id: v._id,
      title: v.title,
      sku: v.sku || undefined,
      ean: v.ean || undefined,
      inventory_quantity: v.inventory_quantity,
      prices: v.prices.map(price => ({
        amount: parseFloat(price.amount),
        currency_code: price.region_id ? undefined : price.currency_code,
        region_id: price.region_id,
      })),
      options: v.options.map(o => ({
        value: o.value,
        option_id: o.option_id,
      })),
    }))

    onSubmit({ variants: payload })
  }

  const handleVariantEdited = data => {
    const newVs = [...variants]
    newVs[editIndex] = {
      ...newVs[editIndex],
      ...data,
    }

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

  return (
    <>
      <Card as="form" onSubmit={handleSubmit}>
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
                onChange={vs => setVariants(vs)}
              />
            </Flex>
          )}
        </Card.Body>
        <Card.Footer px={3} justifyContent="flex-end">
          <Button variant={"cta"} type="submit">
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
