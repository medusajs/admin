import React from "react"
import { useForm } from "react-hook-form"
import { Flex } from "rebass"
import ReactJson from "react-json-view"
import { navigate } from "gatsby"

import Information from "./information"
import Variants from "./variants"
import Images from "./images"

import useMedusa from "../../../hooks/use-medusa"
import NotFound from "../../../components/not-found"
import Card from "../../../components/card"

const ProductDetail = ({ id }) => {
  const details = useForm()
  const {
    product,
    variants,
    options,
    isLoading,
    delete: productDelete,
    update,
    refresh,
    toaster,
    didFail,
  } = useMedusa("products", { id })

  const handleProductDelete = () => {
    productDelete().then(() => navigate("/a/products"))
  }

  const handleDetailsSubmit = data => {
    update(data)
  }

  const handleVariantsSubmit = data => {
    update(data)
  }

  if (didFail) {
    return <NotFound />
  }

  return (
    <Flex flexDirection="column" mb={5}>
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
      <Images
        product={product}
        isLoading={isLoading}
        refresh={refresh}
        toaster={toaster}
      />
      <Card mr={3} width="100%">
        <Card.Header>Raw product</Card.Header>
        <Card.Body>
          <ReactJson
            name={false}
            collapsed={true}
            src={product}
            style={{ marginLeft: "20px" }}
          />
        </Card.Body>
      </Card>
    </Flex>
  )
}

export default ProductDetail
