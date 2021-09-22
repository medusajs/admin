import styled from "@emotion/styled"
import { Checkbox, Label } from "@rebass/forms"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Box, Flex, Text } from "rebass"
import { removeNullish } from "../../../../utils/remove-nullish"
import { ReactComponent as CloseIcon } from "../../../../assets/svg/cross.svg"
import { ReactComponent as DeleteIcon } from "../../../../assets/svg/delete.svg"
import Button from "../../../../components/button"
import CurrencyInput from "../../../../components/currency-input"
import Input from "../../../../components/input"
import Modal from "../../../../components/modal"
import Typography from "../../../../components/typography"
import useMedusa from "../../../../hooks/use-medusa"

const StyledLabel = styled(Label)`
  ${Typography.Base};
  display: flex;
  align-items: center;
  font-weight: 300;
`

const TextButton = styled(Button)`
  ${Typography.Base}
  outline: none;
  border: none;
  box-shadow: none;
  background: none;
  font-weight: 500;
  color: #5469d3;
  padding: 2px;
  transition: color 0.2s ease-in;
  &:hover {
    box-shadow: none;
    color: #4354a8;
  }
`

const VariantEditor = ({
  variant,
  options,
  onSubmit,
  onDelete,
  onClick,
  isCopy,
}) => {
  const { store, isLoading } = useMedusa("store")

  const [currencyOptions, setCurrencyOptions] = useState([])
  const [prices, setPrices] = useState(variant.prices)

  const { control, setValue, register, reset, handleSubmit } = useForm(variant)

  useEffect(() => {
    reset({
      ...variant,
    })

    variant.options.forEach((option, index) => {
      register(`options.${index}.option_id`)
      setValue(`options.${index}.option_id`, option.option_id)
    })
  }, [variant])

  const getCurrencyOptions = () => {
    return ((store && store.currencies) || [])
      .map(v => ({
        value: v.code.toUpperCase(),
        label: v.code.toUpperCase(),
      }))
      .filter(o => !prices.find(p => !p.edit && p.currency_code === o.value))
  }

  useEffect(() => {
    setCurrencyOptions(getCurrencyOptions())
  }, [store, isLoading, variant.prices])

  const handleCurrencySelected = (index, currency) => {
    const newPrices = [...prices]
    newPrices[index] = {
      ...newPrices[index],
      currency_code: currency.toLowerCase(),
    }

    setPrices(newPrices)
  }

  const handlePriceChange = (index, e) => {
    const element = e.target
    const value = Math.round(element.value * 100)

    const newPrices = [...prices]
    newPrices[index] = {
      ...newPrices[index],
      amount: value,
    }

    setPrices(newPrices)
  }

  const removePrice = index => {
    const newPrices = [...prices]
    newPrices.splice(index, 1)
    setPrices(newPrices)
  }

  const addPrice = () => {
    const newPrices = [
      ...prices,
      {
        edit: true,
        region: "",
        currency_code: currencyOptions[0].value,
        amount: "",
        sale_amount: "",
      },
    ]

    setPrices(newPrices)
  }

  const handleSave = data => {
    data.prices = prices.map(({ currency_code, region_id, amount }) => ({
      currency_code,
      region_id,
      amount: Math.round(amount),
    }))

    data.prices = data.prices.map(p => removeNullish(p))
    const clean = removeNullish(data)
    onSubmit(clean)
  }

  return (
    <Modal onClick={onClick}>
      <Modal.Body as="form" onSubmit={handleSubmit(handleSave)}>
        <Modal.Header justifyContent="space-between" alignItems="center" px={4}>
          <Text fontSize="18px" fontWeight={700}>
            Product Variant Details
          </Text>
          <CloseIcon
            style={{ cursor: "pointer" }}
            onClick={onClick}
            width={12}
            height={12}
          />
        </Modal.Header>
        <Modal.Content px={4} flexDirection="column">
          <Box mb={4}>
            <Text fontWeight={700} fontSize={2} mb={3}>
              Variant Information
            </Text>
            <Input
              mt={2}
              mb={3}
              label="Title"
              name="title"
              ref={register}
              boldLabel={true}
            />
            {options.map((o, index) => (
              <Input
                mb={3}
                key={o._id}
                label={o.title}
                name={`options.${index}.value`}
                ref={register}
                boldLabel={true}
              />
            ))}
            <Input
              mb={3}
              label="SKU"
              name="sku"
              placeholder="SKU"
              boldLabel={true}
              ref={register}
            />
          </Box>
          <Box width={1 / 2} mb={4}>
            <Text mb={3} fontSize={2} fontWeight={700}>
              Inventory
            </Text>
            <Box mb={2}>
              <StyledLabel>
                <Checkbox ref={register} mr={1} name="manage_inventory" />
                Manage Inventory
              </StyledLabel>
            </Box>
            <Box mb={3}>
              <StyledLabel>
                <Checkbox ref={register} mr={1} name="allow_backorder" />
                Allow backorders
              </StyledLabel>
            </Box>
            <Box mb={3}>
              <Input
                mr={3}
                label="Inventory quantity"
                name="inventory_quantity"
                placeholder="Inventory quantity"
                type="number"
                boldLabel={true}
                ref={register}
              />
            </Box>
          </Box>
          <Box mb={4}>
            <Text mb={3} fontSize={2} fontWeight={700}>
              Prices
            </Text>
            {prices.map((p, index) => (
              <Flex
                alignItems="center"
                mb={3}
                key={`${p.currency_code}${index}`}
              >
                <CurrencyInput
                  edit={p.edit}
                  currency={p.currency_code.toUpperCase()}
                  currencyOptions={currencyOptions}
                  value={p.amount / 100}
                  onCurrencySelected={currency =>
                    handleCurrencySelected(index, currency)
                  }
                  onChange={e => handlePriceChange(index, e)}
                />

                <Box
                  ml={2}
                  sx={{
                    cursor: "pointer",
                    "& svg": {
                      fill: "#5469D3",
                      transition: "fill 0.2s ease-in",
                    },
                    ":hover svg": { fill: "#4354a8" },
                  }}
                  onClick={() => removePrice(index)}
                >
                  <DeleteIcon />
                </Box>
              </Flex>
            ))}
            {currencyOptions.length !== prices.length && (
              <Flex mb={3}>
                <TextButton onClick={addPrice} variant="primary">
                  + Add a price
                </TextButton>
              </Flex>
            )}
          </Box>
          <Box mb={4}>
            <Text fontSize={2} fontWeight={700} mb={3}>
              Stock
            </Text>
            <Flex mb={3}>
              <Input
                mr={3}
                label="EAN"
                name="ean"
                placeholder="EAN"
                boldLabel={true}
                ref={register}
              />
              <Input
                mr={3}
                label="UPC Barcode"
                name="barcode"
                placeholder="Barcode"
                type="number"
                boldLabel={true}
                ref={register}
              />
            </Flex>
          </Box>
          <Box mb={4}>
            <Text fontSize={2} fontWeight={700} mb={3}>
              Dimensions
            </Text>
            <Flex mb={3}>
              <Input
                mr={3}
                label="Height"
                placeholder="Product Height"
                name="height"
                boldLabel={true}
                ref={register}
              />
              <Input
                mr={3}
                label="Width"
                placeholder="Product Width"
                name="width"
                boldLabel={true}
                ref={register}
              />
            </Flex>
            <Flex mb={3}>
              <Input
                mr={3}
                label="Length"
                name="length"
                placeholder="Product Length"
                boldLabel={true}
                ref={register}
              />
              <Input
                mr={3}
                label="Weight"
                name="weight"
                placeholder="Product Weight"
                boldLabel={true}
                ref={register}
              />
            </Flex>
          </Box>
          <Box mb={4}>
            <Text fontSize={2} fontWeight={700} mb={3}>
              Customs
            </Text>
            <Flex mb={3}>
              <Input
                mr={3}
                label="MID Code"
                placeholder="MID Code"
                name="mid_code"
                boldLabel={true}
                ref={register}
              />
              <Input
                mr={3}
                label="HS Code"
                placeholder="HS Code"
                name="hs_code"
                boldLabel={true}
                ref={register}
              />
            </Flex>
            <Flex mb={4}>
              <Input
                mr={3}
                label="Country of origin"
                name="origin_country"
                placeholder="Country of origin"
                boldLabel={true}
                ref={register}
              />
              <Input
                mr={3}
                label="Material"
                name="material"
                placeholder="Material"
                boldLabel={true}
                ref={register}
              />
            </Flex>
          </Box>
          {!isCopy && (
            <Box>
              <Text mb={3} fontWeight={700}>
                Danger Zone
              </Text>
              <Button onClick={onDelete} variant="danger">
                Delete variant
              </Button>
            </Box>
          )}
        </Modal.Content>
        <Modal.Footer justifyContent="flex-end">
          <Button mr={2} onClick={onClick} type="button" variant="primary">
            Cancel
          </Button>
          <Button type="submit" variant="deep-blue">
            {isCopy ? "Create" : "Save"}
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default VariantEditor
