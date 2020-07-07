import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Text, Flex, Box } from "rebass"
import { navigate } from "gatsby"

import Information from "./information"
import Variants from "./variants"

import useMedusa from "../../../hooks/use-medusa"

const ProductDetail = ({ id }) => {
  const details = useForm()
  const {
    product,
    variants,
    options,
    isLoading,
    delete: productDelete,
    update,
  } = useMedusa("products", { id })

  const handleProductDelete = () => {
    productDelete().then(() => navigate("a/products"))
  }

  const handleDetailsSubmit = data => {
    update(data)
  }

  const handleVariantsSubmit = data => {
    update(data)
  }

  return (
    <Flex flexDirection="column">
      <Information
        product={product}
        isLoading={isLoading}
        onSubmit={handleDetailsSubmit}
        onDelete={handleProductDelete}
      />
      <Variants
        edit
        optionMethods={options}
        variantMethods={variants}
        product={product}
        isLoading={isLoading}
        onChange={vs => setVariants(vs)}
        onSubmit={handleVariantsSubmit}
      />
    </Flex>
  )
}

export default ProductDetail
