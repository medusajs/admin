import React, { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { Text, Flex, Box } from "rebass"

import Information from "./information"
import Variants from "./variants"

import useMedusa from "../../../hooks/use-medusa"

const ProductDetail = ({ id }) => {
  const details = useForm()
  const { product, isLoading, update } = useMedusa("products", { id })

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
      />
      <Variants
        edit
        product={product}
        isLoading={isLoading}
        onChange={vs => setVariants(vs)}
        onSubmit={handleVariantsSubmit}
      />
    </Flex>
  )
}

export default ProductDetail
