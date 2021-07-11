import React, { useEffect, useState } from "react"
import { Text, Flex, Box, Image } from "rebass"

import Modal from "../../../../components/modal"
import Button from "../../../../components/button"
import Input from "../../../../components/input"
import Dot from "../../../../components/dot"
import Pill from "../../../../components/pill"
import { useForm } from "react-hook-form"
import Medusa from "../../../../services/api"
import CurrencyInput from "../../../../components/currency-input"
import Dropdown from "../../../../components/dropdown"
import { Switch } from "@rebass/forms"
import styled from "@emotion/styled"
import { displayUnitPrice, extractUnitPrice } from "../../../../utils/prices"

const StyledSwitch = styled(Switch)`
  border-color: #454b54;

  &:focus {
    box-shadow: none;
  }

  div {
    border-color: #454b54;
    background: #454b54;
  }

  &[aria-checked="true"] {
    background-color: transparent;
  }
`

const ItemModal = ({ region, draftOrderId, item = {}, refresh, dismiss }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState([])
  const [price, setPrice] = useState(item.price || null)
  const [selected, setSelected] = useState(null)

  const [addCustom, setAddCustom] = useState(true)

  const { register, reset, handleSubmit } = useForm()

  useEffect(() => {
    if (item) {
      reset({ ...item })
    }
  }, [])

  useEffect(() => {
    if (addCustom) {
      setSelected(null)
      setSearchResults([])
    }
  }, [addCustom])

  const handleProductSearch = async q => {
    try {
      const { data } = await Medusa.variants.list({ q })
      setSearchResults(data.variants)
    } catch (error) {
      throw Error("Could not fetch products")
    }
  }

  const onSubmit = async data => {
    setIsLoading(true)

    if (selected) {
      data.variant_id = selected.id
      data.quantity = selected.quantity
    }

    data.unit_price = price * 100

    if (item.id) {
      await Medusa.draftOrders.updateLineItem(draftOrderId, item.id, data)
    } else {
      await Medusa.draftOrders.addLineItem(draftOrderId, data)
    }

    if (refresh) {
      refresh({ id: draftOrderId })
      dismiss()
    }

    setIsLoading(false)
  }

  return (
    <Modal as="form" onSubmit={handleSubmit(onSubmit)}>
      <Modal.Body>
        <Modal.Header>{item?.id ? "Edit item" : "Add item"}</Modal.Header>
        <Modal.Content
          flexDirection="column"
          minWidth="600px"
          minHeight="300px"
        >
          {!item.id && (
            <Flex justifyContent="center" width="100%" mb={4}>
              <Text mr={2} fontSize={0}>
                Custom
              </Text>
              <StyledSwitch
                checked={!addCustom}
                onClick={() => setAddCustom(!addCustom)}
              />
              <Text ml={2} fontSize={0}>
                Existing
              </Text>
            </Flex>
          )}
          {addCustom ? (
            <>
              <Flex>
                <Input
                  my={2}
                  label="Title"
                  required={true}
                  placeholder="Jersey"
                  width="100%"
                  name="title"
                  inline={true}
                  boldLabel={true}
                  start={true}
                  value={item?.title || null}
                  ref={register}
                />
              </Flex>
              <Flex>
                <CurrencyInput
                  edit={false}
                  boldLabel={true}
                  required={true}
                  inline={true}
                  start={true}
                  width="100%"
                  value={price || 0}
                  currency={region.currency_code}
                  onChange={({ currentTarget }) =>
                    setPrice(currentTarget.value)
                  }
                  label={"Price (excl. taxes)"}
                />
              </Flex>
              <Flex>
                <Input
                  autocomplete="off"
                  my={2}
                  inline={true}
                  boldLabel={true}
                  start={true}
                  label="Quantity"
                  type="number"
                  ref={register}
                  value={item.quantity || 1}
                  name="quantity"
                  required={true}
                  width="100%"
                />
              </Flex>
            </>
          ) : selected === null ? (
            <Flex justifyContent="flex-start" width="100%">
              <Dropdown
                disabled={!region}
                showSearch
                leftAlign={true}
                onSearchChange={handleProductSearch}
                dropdownWidth="100% !important"
                dropdownHeight="180px !important"
                searchPlaceholder={"Search by SKU, Name, etc."}
                showTrigger={false}
                topPlacement="-50px"
              >
                {searchResults.map(s => (
                  <Flex
                    key={s.variant_id}
                    alignItems="center"
                    onClick={() => setSelected({ ...s, quantity: 1 })}
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
            </Flex>
          ) : null}
          <Box mt={3} mb={3}>
            {selected && (
              <Flex
                sx={{ borderBottom: "hairline" }}
                justifyContent="space-between"
                fontSize={1}
                py={2}
              >
                <Box width={"10%"} px={2} py={1}></Box>
                <Box width={"35%"} px={2} py={1}>
                  Details
                </Box>
                <Box width={"20%"} px={2} py={1}>
                  Quantity
                </Box>
                <Box width={"30%"} px={2} py={1}>
                  Price (excl. taxes)
                </Box>
              </Flex>
            )}
            {selected && (
              <Flex
                key={selected.variant_id}
                justifyContent="space-between"
                py={2}
                pr={2}
                alignItems="center"
              >
                <Flex maxWidth="10%" height="100%">
                  <Image
                    src={selected?.product?.thumbnail || ImagePlaceholder}
                    height={30}
                    width={30}
                    p={!selected?.product?.thumbnail && "8px"}
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
                    {selected.title}
                  </Text>
                  {selected?.product?.title && (
                    <Text fontSize="12px" lineHeight={"14px"}>
                      {selected.product.title}
                    </Text>
                  )}
                </Flex>
                <Box width={"15%"} px={2} py={1}>
                  <Input
                    type="number"
                    fontSize="12px"
                    onChange={e => {
                      setSelected({
                        ...selected,
                        quantity: parseInt(e.target.value),
                      })
                    }}
                    value={selected.quantity || ""}
                    min={1}
                  />
                </Box>
                <Box width={"30%"} px={2} py={1}>
                  <CurrencyInput
                    edit={false}
                    required={true}
                    value={extractUnitPrice(selected, region, false) / 100}
                    currency={region.currency_code}
                    onChange={({ currentTarget }) =>
                      setPrice(currentTarget.value)
                    }
                  />
                </Box>
                <Flex alignItems="center" onClick={() => setSelected(null)}>
                  &times;
                </Flex>
              </Flex>
            )}
          </Box>
        </Modal.Content>
        <Modal.Footer justifyContent="">
          <Button loading={false} variant="primary" onClick={dismiss}>
            Cancel
          </Button>
          <Box ml="auto" />
          <Button loading={isLoading} variant="cta" type="submit">
            Save
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default ItemModal
