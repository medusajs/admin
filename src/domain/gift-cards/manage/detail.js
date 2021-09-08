import React, { useState, useEffect } from "react"
import _ from "lodash"
import { useForm } from "react-hook-form"
import { Text, Flex, Box } from "rebass"
import { navigate } from "gatsby"

import Information from "../../products/details/information"
import Images from "../../products/details/images"

import { displayAmount } from "../../../utils/prices"
import useMedusa from "../../../hooks/use-medusa"
import NotFound from "../../../components/not-found"
import Card from "../../../components/card"
import Button from "../../../components/button"
import PriceEditor from "../../../components/variant-grid/editors/prices"

const GiftCardDetail = ({ id }) => {
  const [productVariants, setProductVariants] = useState([])

  const {
    product,
    isLoading,
    delete: productDelete,
    update,
    refresh,
    toaster,
    didFail,
  } = useMedusa("products", { id })

  useEffect(() => {
    if (isLoading) {
      return
    }
    setProductVariants(product.variants)
  }, [product, isLoading])

  const handleProductDelete = () => {
    productDelete().then(() => navigate("/a/products"))
  }

  const handleDetailsSubmit = data => {
    update(data)
  }

  const handleVariantsSubmit = () => {
    update({
      variants: productVariants.map((v, index) => ({
        ..._.pick(v, [
          "id",
          "published",
          "image",
          "barcode",
          "ean",
          "sku",
          "inventory_quantity",
          "manage_inventory",
          "metadata",
        ]),
        title: `${index + 1}`,
        prices: v.prices.map(({ amount, currency_code, region_id }) => ({
          amount,
          currency_code,
          region_id,
        })),
        options: [
          {
            option_id: product.options[0].id,
            value: index + 1,
          },
        ],
      })),
    })
  }

  const handleAddVariant = () => {
    const newVariants = [
      ...productVariants,
      {
        prices: [],
      },
    ]

    setProductVariants(newVariants)
  }

  const handlePricesChange = (index, data) => {
    const newVariant = {
      ...productVariants[index],
      prices: data,
    }

    const newVariants = [...productVariants]
    newVariants.splice(index, 1, newVariant)
    setProductVariants(newVariants)
  }

  const handleRemove = index => {
    const newVariants = [...productVariants]
    newVariants.splice(index, 1)
    setProductVariants(newVariants)
  }

  if (didFail) {
    return <NotFound />
  }

  return (
    <Flex flexDirection="column">
      <Information
        product={product}
        isLoading={isLoading}
        onSubmit={handleDetailsSubmit}
        onDelete={handleProductDelete}
      />
      <Card>
        <Card.Header>Denominations</Card.Header>
        <Card.Body px={3}>
          <Flex width={1} maxWidth="550px" flexDirection="column">
            {productVariants.map((v, index) => (
              <Flex my={2} justifyContent="space-between">
                <Box mr={4}>{index + 1}</Box>
                <Box flexGrow="2">
                  {v.prices
                    .map(
                      ({ currency_code, amount }) =>
                        `${displayAmount(
                          currency_code,
                          amount
                        )} ${currency_code.toUpperCase()}`
                    )
                    .join(", ")}
                </Box>
                <Box>
                  <PriceEditor
                    onChange={data => handlePricesChange(index, data)}
                    value={v.prices}
                  />
                </Box>
                <Box
                  sx={{
                    cursor: "pointer",
                  }}
                  px={3}
                  alignSelf="center"
                  onClick={() => handleRemove(index)}
                >
                  &times;
                </Box>
              </Flex>
            ))}
            <Flex mt={2}>
              <Button variant={"primary"} onClick={handleAddVariant}>
                + Add Denomination
              </Button>
            </Flex>
          </Flex>
        </Card.Body>
        <Card.Footer px={3} justifyContent="flex-end">
          <Button variant={"cta"} onClick={handleVariantsSubmit}>
            Save
          </Button>
        </Card.Footer>
      </Card>
      {product && product.images && (
        <Images
          product={product}
          isLoading={isLoading}
          refresh={refresh}
          toaster={toaster}
        />
      )}
    </Flex>
  )
}

export default GiftCardDetail
