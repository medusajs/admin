import React, { useState } from "react"
import ImagePlaceholder from "../../../assets/svg/image-placeholder.svg"
import { Box, Flex, Image, Text } from "rebass"
import Spinner from "../../../components/spinner"
import Dropdown from "../../../components/dropdown"
import Dot from "../../../components/dot"

const ProductSelection = ({
  items,
  handleAddItem,
  handleProductSearch,
  handleRemoveItem,
  searchResults,
  searchingProducts,
}) => {
  return (
    <>
      <Flex justifyContent="space-between">
        <Dropdown
          toggleText={"+ Add item"}
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
          <Flex sx={{ borderBottom: "hairline" }} fontSize={1} py={2}>
            <Box width={"5%"} px={2} py={1}></Box>
            <Box width={"40%"} px={2} py={1}>
              Details
            </Box>
          </Flex>
        )}
        {items.map((item, index) => {
          return (
            <Flex key={item.variant_id} py={2} pr={2} alignItems="left">
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
                width={"100%"}
                px={2}
                py={1}
                height="100%"
                flexDirection="row"
              >
                <Text fontSize="12px" lineHeight={"14px"}>
                  {item.title}
                </Text>
                &nbsp;
                {item?.product?.title && (
                  <Text fontSize="12px" lineHeight={"14px"}>
                    {item.product.title}
                  </Text>
                )}
              </Flex>
              <Flex
                alignItems="center"
                sx={{ cursor: "pointer" }}
                onClick={() => handleRemoveItem(index)}
              >
                &times;
              </Flex>
            </Flex>
          )
        })}
      </Box>
    </>
  )
}

export default ProductSelection
