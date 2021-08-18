import React, { useState } from "react"
import Input from "../../../../components/input"
import { Box, Flex, Image, Text } from "rebass"
import styled from "@emotion/styled"
import Dropdown from "../../../../components/dropdown"
import Dot from "../../../../components/dot"

import ImagePlaceholder from "../../../../assets/svg/image-placeholder.svg"
import Button from "../../../../components/button"
import CurrencyInput from "../../../../components/currency-input"
import { displayUnitPrice, extractUnitPrice } from "../../../../utils/prices"
import Spinner from "../../../../components/spinner"

const Items = ({
  items,
  handleAddItem,
  handleAddQuantity,
  handleProductSearch,
  handleRemoveItem,
  selectedRegion,
  searchResults,
  searchingProducts,
  handlePriceChange,
  handleAddCustom,
}) => {
  const [addCustom, setAddCustom] = useState(false)
  const [title, setTitle] = useState("")
  const [price, setPrice] = useState(null)
  const [quantity, setQuantity] = useState(1)

  const addCustomItem = () => {
    handleAddCustom({
      title,
      unit_price: price * 100,
      quantity: parseInt(quantity),
    })
    setAddCustom(false)
    setTitle("")
    setQuantity(1)
    setPrice(null)
  }

  if (addCustom) {
    return (
      <Flex flexDirection="column" minHeight="400px">
        <Flex justifyContent="space-between" flexDirection="column">
          <Text fontSize={1} fontWeight="600">
            Adding custom item
          </Text>
          <Flex>
            <Input
              my={2}
              label="Title"
              required={true}
              width="100%"
              name="title"
              inline={true}
              start={true}
              onChange={({ currentTarget }) => setTitle(currentTarget.value)}
              placeholder="E.g. giftwrapping"
            />
          </Flex>
          <Flex>
            <CurrencyInput
              edit={false}
              required={true}
              inline={true}
              start={true}
              width="100%"
              currency={selectedRegion.currency_code}
              onChange={({ currentTarget }) => setPrice(currentTarget.value)}
              label={"Price"}
            />
          </Flex>
          <Flex>
            <Input
              autocomplete="off"
              my={2}
              inline={true}
              start={true}
              label="Quantity"
              type="number"
              value={quantity}
              onChange={({ currentTarget }) => setQuantity(currentTarget.value)}
              required={true}
              width="100%"
            />
          </Flex>
        </Flex>
        <Box mt="auto" />
        <Flex>
          <Button
            variant="primary"
            width="180px"
            onClick={() => setAddCustom(false)}
          >
            Cancel
          </Button>
          <Box ml="auto" />
          <Button
            variant="primary"
            width="180px"
            onClick={() => addCustomItem()}
          >
            Save item
          </Button>
        </Flex>
      </Flex>
    )
  }

  return (
    <Flex flexDirection="column" minHeight="400px">
      <Flex justifyContent="space-between">
        <Text fontSize={1}>Items for the order</Text>
        <Box ml="auto" />
        <Button
          variant="primary"
          onClick={() => setAddCustom(true)}
          minHeight="33px"
          mr={2}
        >
          + Add custom
        </Button>
        <Dropdown
          disabled={!selectedRegion}
          toggleText={"+ Add existing"}
          showSearch
          onSearchChange={handleProductSearch}
          dropdownWidth="275px !important"
          dropdownHeight="325px !important"
          searchPlaceholder={"Search by SKU, Name, etc."}
        >
          {searchingProducts ? (
            <Flex
              alignItems="center"
              justifyContent="center"
              py={3}
              sx={{ height: "75px" }}
            >
              <Spinner dark sx={{ width: "40px", height: "40px" }} />
            </Flex>
          ) : (
            searchResults.map(s => (
              <Flex
                key={s.variant_id}
                alignItems="center"
                onClick={() => handleAddItem(s)}
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
            ))
          )}
        </Dropdown>
      </Flex>
      <Box mt={3} mb={3}>
        {items.length > 0 && (
          <Flex
            sx={{ borderBottom: "hairline" }}
            justifyContent="space-between"
            fontSize={1}
            py={2}
          >
            <Box width={"5%"} px={2} py={1}></Box>
            <Box width={"40%"} px={2} py={1}>
              Details
            </Box>
            <Box width={"20%"} px={2} py={1}>
              Quantity
            </Box>
            <Box width={"35%"} px={2} py={1}>
              Price (excl. taxes)
            </Box>
          </Flex>
        )}
        {items.map((item, index) => {
          let itemPrice = extractUnitPrice(item, selectedRegion, false)

          return (
            <Flex
              key={item.variant_id}
              justifyContent="space-between"
              py={2}
              pr={2}
              alignItems="center"
            >
              <Flex maxWidth="10%" height="100%">
                <Image
                  src={item?.product?.thumbnail || ImagePlaceholder}
                  height={30}
                  width={30}
                  p={!item?.product?.thumbnail && "8px"}
                  sx={{ objectFit: "contain", border: "1px solid lightgray" }}
                />
              </Flex>
              <Flex
                width={"35%"}
                px={2}
                py={1}
                height="100%"
                flexDirection="column"
              >
                <Text fontSize="12px" lineHeight={"14px"}>
                  {item.title}
                </Text>
                {item?.product?.title && (
                  <Text fontSize="12px" lineHeight={"14px"}>
                    {item.product.title}
                  </Text>
                )}
              </Flex>
              <Box width={"15%"} px={2} py={1}>
                <Input
                  type="number"
                  fontSize="12px"
                  onChange={e => handleAddQuantity(e, index)}
                  value={item.quantity || ""}
                  min={1}
                />
              </Box>
              <Box width={"30%"} px={2} py={1}>
                <CurrencyInput
                  edit={false}
                  required={true}
                  value={itemPrice / 100}
                  currency={selectedRegion.currency_code}
                  onChange={({ currentTarget }) => {
                    handlePriceChange(index, currentTarget.value)
                  }}
                />
              </Box>
              <Flex alignItems="center" onClick={() => handleRemoveItem(index)}>
                &times;
              </Flex>
            </Flex>
          )
        })}
      </Box>
    </Flex>
  )
}

export default Items
