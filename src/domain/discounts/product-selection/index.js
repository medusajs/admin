import React, { useState, useCallback } from "react"
import MultiSelect from "../../../components/multi-select"
import _ from "lodash"
import Medusa from "../../../services/api"
import { Text, Flex } from "rebass"

const ProductSelection = ({ selectedProducts, setSelectedProducts }) => {
  const [searchingProducts, setSearchingProducts] = useState(false)
  const [searchResults, setSearchResults] = useState([])

  const fetchProduct = async q => {
    const { data } = await Medusa.products.list({ q })
    setSearchResults([...data.products])
    setSearchingProducts(false)
  }

  const handleProductSearch = async title => {
    setSearchingProducts(true)
    try {
      fetchProduct(title)
    } catch (error) {
      throw Error("Could not fetch products")
    }
  }

  const customRenderer = (selected, _option) => {
    if (selected.length == 0) return "Select products"
    if (selected.length == 1) return selected[0].label

    return _.reduce(
      selected,
      (str, { label }) => `${str}, ${label}`,
      ""
    ).substring(1)
  }

  return (
    <Flex ml={3}>
      <MultiSelect
        inline
        start={true}
        mb={3}
        options={searchResults.map(product => ({
          label: product.title,
          value: product,
        }))}
        customValueRend
        debounceDuration={500}
        selectOptions={{
          hasSelectAll: false,
          valueRenderer: customRenderer,
        }}
        value={selectedProducts}
        onChange={setSelectedProducts}
        onKeyUp={e => handleProductSearch(e.target.value)}
        onKeyPress={e => handleProductSearch(e.target.value)}
        isLoading={searchingProducts}
      />
    </Flex>
  )
}

export default ProductSelection
