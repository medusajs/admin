import React, { useEffect, useState } from "react"
import { Text, Flex, Box } from "rebass"

import VariantEditor from "./modal"
import VariantGrid from "../../../../components/variant-grid"
import Button from "../../../../components/button"
import Card from "../../../../components/card"
import Input from "../../../../components/input"
import TextArea from "../../../../components/textarea"
import Spinner from "../../../../components/spinner"

const Variants = ({ product, isLoading, onSubmit }) => {
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
    { label: "Add option...", onClick: () => console.log("New option") },
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
  ]

  const handleSubmit = e => {
    e.preventDefault()

    const payload = variants.map(v => ({
      _id: v._id,
      title: v.title,
      sku: v.sku,
      ean: v.ean,
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

  const handleVariantEdited = (data) => {


  }

  return (
    <>
      <Card as="form" onSubmit={handleSubmit}>
        <Card.Header dropdownOptions={dropdownOptions}>Variants</Card.Header>
        <Card.Body px={3}>
          {isLoading ? (
            <Spinner />
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
          <Button type="submit">Save</Button>
        </Card.Footer>
      </Card>
      {editVariant && (
        <VariantEditor
          variant={editVariant}
          options={product.options}
          onSubmit={data => handleVariantEditted(data)}
          onClick={() => setEditVariant(null)}
        />
      )}
    </>
  )
}

export default Variants
