import React from "react"
import { Flex } from "rebass"
import { Router } from "@reach/router"

import Spinner from "../../components/spinner"
import New from "./new"

import useMedusa from "../../hooks/use-medusa"

const ProductIndex = () => {
  const { products, isLoading } = useMedusa("products")

  return (
    <Flex flexDirection="column">
      {isLoading ? (
        <Spinner />
      ) : (
        products.map(p => <Flex key={p.id}>{p.title}</Flex>)
      )}
    </Flex>
  )
}

const Products = () => {
  return (
    <>
      <Router>
        <ProductIndex path="/" />
        <New path="new" />
      </Router>
    </>
  )
}

export default Products
