import { navigate } from "gatsby"
import React from "react"
import ReactJson from "react-json-view"
import { Flex } from "rebass"
import Card from "../../../components/card"
import NotFound from "../../../components/not-found"
import useMedusa from "../../../hooks/use-medusa"
import useNotification from "../../../hooks/use-notification"
import { getErrorMessage } from "../../../utils/error-messages"
import Images from "./images"
import Information from "./information"
import InventoryManager from "./inventory"
import Variants from "./variants"

const ProductDetail = ({ id }) => {
  const {
    product,
    variants,
    options,
    isLoading,
    delete: productDelete,
    update,
    refresh,
    didFail,
  } = useMedusa("products", { id })

  const notification = useNotification()

  const handleProductDelete = () => {
    productDelete().then(() => {
      refresh({ id })
      notification("Success", "The product was deleted", "success")
      navigate("/a/products")
    })
  }

  const handleDetailsSubmit = (data) => {
    update(data)
      .then(() => {
        refresh({ id })
        notification("Success", "Successfully updated product", "success")
      })
      .catch((error) => notification("Error", getErrorMessage(error), "error"))
  }

  const handleVariantsSubmit = (data) => {
    update(data).then(() => {
      refresh({ id })
      notification("Success", "Successfully updated product", "success")
    })
  }

  if (didFail) {
    return <NotFound />
  }

  return (
    <Flex flexDirection="column" pb={5} pt={5}>
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
        onChange={(vs) => setVariants(vs)}
        onSubmit={handleVariantsSubmit}
        toaster={toaster}
      />
      <Images
        product={product}
        isLoading={isLoading}
        refresh={refresh}
        toaster={toaster}
      />
      <InventoryManager product={product} onSubmit={handleDetailsSubmit} />
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
