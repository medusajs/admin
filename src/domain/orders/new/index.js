import styled from "@emotion/styled"
import { Label, Radio } from "@rebass/forms"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { MultiSelect } from "react-multi-select-component"
import { Box, Flex, Text } from "rebass"
import Dropdown from "../../../components/dropdown"
import Input from "../../../components/molecules/input"
import Select from "../../../components/select"
import Spinner from "../../../components/spinner"
import Typography from "../../../components/typography"
import useMedusa from "../../../hooks/use-medusa"
import Medusa from "../../../services/api"
import ProductSelector from "./product-selector"

const Dot = styled(Box)`
  width: 6px;
  height: 6px;
  border-radius: 50%;
`

export const StyledMultiSelect = styled(MultiSelect)`
  ${Typography.Base}

  color: black;
  background-color: white;

  line-height: 1.22;

  border: none;
  outline: 0;

  transition: all 0.2s ease;

  border-radius: 3px;
  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(60, 66, 87, 0.16) 0px 0px 0px 1px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
    rgba(0, 0, 0, 0) 0px 0px 0px 0px;

  &:focus: {
    box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(206, 208, 190, 0.36) 0px 0px 0px 4px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(60, 66, 87, 0.16) 0px 0px 0px 1px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
      rgba(0, 0, 0, 0) 0px 0px 0px 0px;
  }
  &::placeholder: {
    color: #a3acb9;
  }

  .go3433208811 {
    border: none;
    border-radius: 3px;
  }
`

const StyledRadio = styled(Radio)`
  ${Typography.Base}
`

const StyledLabel = styled(Label)`
  ${Typography.Base}

  input[type="radio"]:checked ~ svg {
    color: #79b28a;
  }
`

const RequiredLabel = styled.div`
  ${Typography.Base}
  ${(props) =>
    props.inline
      ? `
  text-align: right;
  padding-right: 15px;
  `
      : `
  padding-bottom: 10px;
  `}

  &:after {
    color: rgba(255, 0, 0, 0.5);
    content: " *";
  }
`

const ItemContainer = styled(Flex)``

const NewOrder = ({}) => {
  const [selectedRegions, setSelectedRegions] = useState([])
  const [selectedProducts, setSelectedProducts] = useState([])
  const [variants, setVariants] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [showProductSelector, setShowProductSelector] = useState(false)
  const [items, setItems] = useState([])
  const [selectedRegion, setSelectedRegion] = useState(undefined)

  const { register, handleSubmit } = useForm()

  const { products, isLoading: isLoadingProducts } = useMedusa("products")
  const { regions } = useMedusa("regions")

  const handleProductSearch = (val) => {
    Medusa.variants
      .list({
        q: val,
      })
      .then(({ data }) => {
        setSearchResults(data.variants)
      })
  }

  const extractPrice = (prices) => {
    const reg = regions.find((r) => r.id === selectedRegion.value)
    const price = prices.find((ma) => ma.currency_code === reg.currency_code)

    if (price) {
      return (price.amount * (1 + reg.tax_rate / 100)) / 100
    }

    return 0
  }

  const handleAddItemToSwap = (variant) => {
    setItems([...items, { ...variant, quantity: 1 }])
  }

  const handleToAddQuantity = (e, index) => {
    const updated = [...items]
    updated[index] = {
      ...items[index],
      quantity: parseInt(e.target.value),
    }

    setItems(updated)
  }

  const handleRemoveItem = (index) => {
    const updated = [...items]
    updated.splice(index, 1)
    setItems(updated)
  }

  useEffect(() => {
    if (regions) {
      setSelectedRegion({ value: regions[0].id, name: regions[0].name })
    }
  }, [regions])

  useEffect(() => {
    const fetchAllVariants = async () => {
      const newVariants = []
      Promise.all(
        selectedProducts.map(async (product) => {
          const p = await Medusa.products.retrieve(product._id)
          newVariants.push(p.variant)
        })
      )
      setVariants(newVariants)
    }

    fetchAllVariants()
  }, [selectedProducts])

  if (isLoadingProducts) {
    return (
      <Flex flexDirection="column" alignItems="center" height="100vh" mt="auto">
        <Box height="75px" width="75px" mt="50%">
          <Spinner dark />
        </Box>
      </Flex>
    )
  }

  return (
    <Flex
      as="form"
      flexDirection="column"
      onSubmit={handleSubmit}
      pb={5}
      pt={5}
    >
      <Flex mx="auto" width="100%" maxWidth="750px" flexDirection="column">
        <Text mb={4}>Create draft order</Text>
        <Flex flexDirection="column">
          <Text fontSize={1} mb={2}>
            Select region
          </Text>
          <Box mb={3} width={1 / 4}>
            {regions && (
              <Select
                width="300px"
                name="region"
                options={regions.map((r) => ({
                  value: r.id,
                  label: r.name,
                }))}
                ref={register}
              />
            )}
          </Box>
        </Flex>
        <Flex>
          <Box width={4 / 7}>
            <Text fontSize={1}>Items</Text>
            <Box mt={3} mb={3}>
              {items.length > 0 && (
                <Flex
                  sx={{
                    borderBottom: "hairline",
                  }}
                  justifyContent="space-between"
                  fontSize={1}
                  py={2}
                >
                  <Box width={"10%"} px={2} py={1}></Box>
                  <Box width={"50%"} px={2} py={1}>
                    Details
                  </Box>
                  <Box width={"20%"} px={2} py={1}>
                    Quantity
                  </Box>
                  <Box width={"20%"} px={2} py={1}>
                    Price
                  </Box>
                </Flex>
              )}
              {items.map((item, index) => {
                return (
                  <ItemContainer
                    key={item.variant_id}
                    justifyContent="space-between"
                    py={2}
                    pr={2}
                    alignItems="center"
                  >
                    <Box width={"10%"} px={2} py={1}></Box>
                    <Flex
                      width={"50%"}
                      px={2}
                      py={1}
                      alignItems="center"
                      height="100%"
                    >
                      <Text fontSize={1} lineHeight={"14px"}>
                        {item.title}
                      </Text>
                    </Flex>
                    <Box width={"20%"} px={2} py={1}>
                      <Input
                        type="number"
                        onChange={(e) => handleToAddQuantity(e, index)}
                        value={item.quantity || ""}
                        min={1}
                      />
                    </Box>
                    <Box width={"20%"} px={2} py={1}>
                      <Text fontSize={1}>
                        {extractPrice(item.prices).toFixed(2)}{" "}
                      </Text>
                    </Box>
                    <Flex
                      alignItems="center"
                      onClick={() => handleRemoveItem(index)}
                    >
                      &times;
                    </Flex>
                  </ItemContainer>
                )
              })}
            </Box>
            <Dropdown
              disabled={!selectedRegion}
              toggleText={"+ Add product"}
              showSearch
              onSearchChange={handleProductSearch}
              searchPlaceholder={"Search by SKU, Name, etch."}
            >
              {searchResults.map((s) => (
                <Flex
                  key={s.variant_id}
                  alignItems="center"
                  onClick={() => handleAddItemToSwap(s)}
                >
                  <Dot
                    mr={3}
                    bg={s.inventory_quantity > 0 ? "green" : "danger"}
                  />
                  <Box>
                    <Text fontSize={0} mb={0} lineHeight={1}>
                      {s.product.title} - {s.title}
                    </Text>
                    <Flex>
                      <Text width={"100px"} mt={0} fontSize={"10px"}>
                        {s.sku}
                      </Text>
                      <Text ml={2} mt={0} fontSize={"10px"}>
                        In stock: {s.inventory_quantity}
                      </Text>
                    </Flex>
                  </Box>
                </Flex>
              ))}
            </Dropdown>
          </Box>
        </Flex>
      </Flex>
      {showProductSelector && (
        <ProductSelector
          onClick={() => setShowProductSelector(null)}
          selectedProducts={selectedProducts}
          setSelectedProducts={setSelectedProducts}
          products={products}
        />
      )}
    </Flex>
  )
}

export default NewOrder
