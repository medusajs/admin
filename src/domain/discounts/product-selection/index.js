import _ from "lodash"
import React, { useState } from "react"
import { Flex, Text } from "rebass"
import { ReactComponent as TrashIcon } from "../../../assets/svg/trash.svg"
import MultiSelect from "../../../components/molecules/select"
import Medusa from "../../../services/api"

const ProductSelection = ({
  selectedProducts,
  setSelectedProducts,
  onRemove,
}) => {
  const [searchingProducts, setSearchingProducts] = useState(false)
  const [searchResults, setSearchResults] = useState([])

  const fetchProduct = async (q) => {
    const { data } = await Medusa.products.list({ q })
    setSearchResults([...data.products])
    setSearchingProducts(false)
  }

  const handleProductSearch = async (title) => {
    setSearchingProducts(true)
    try {
      fetchProduct(title)
    } catch (error) {
      throw Error("Could not fetch products")
    }
  }

  const customRenderer = (selected, _option) => {
    if (selected.length == 0) {
      return "Select products"
    }
    if (selected.length == 1) {
      return selected[0].label
    }

    return _.reduce(
      selected,
      (str, { label }) => `${str}, ${label}`,
      ""
    ).substring(1)
  }

  const shortLabel = (title) =>
    title.length > 20 ? `${title.substring(0, 19)}...` : title

  const mapItems = (items) =>
    items.map((product) => ({
      label: shortLabel(product.title),
      value: product.id,
    }))

  return (
    <Flex mt={2}>
      <Text mt={1} fontSize={1}>
        Product in
      </Text>
      <Flex ml={3} sx={{ width: 200 }}>
        <MultiSelect
          start={true}
          mb={3}
          options={mapItems(searchResults)}
          debounceDuration={500}
          width={"100%"}
          selectOptions={{
            hasSelectAll: false,
            valueRenderer: customRenderer,
          }}
          value={selectedProducts}
          onChange={setSelectedProducts}
          onKeyUp={(e) => handleProductSearch(e.target.value)}
          onKeyPress={(e) => handleProductSearch(e.target.value)}
          isLoading={searchingProducts}
        />
      </Flex>
      <Flex
        onClick={onRemove}
        alignItems="center"
        ml={3}
        mt={-18}
        sx={{
          cursor: "pointer",
          "& svg": {
            fill: "#ACB4FF",
            transition: "fill 0.2s ease-in",
          },
          ":hover svg": { fill: "#5469D3" },
        }}
      >
        <TrashIcon />
      </Flex>
    </Flex>
  )
}

export default ProductSelection
