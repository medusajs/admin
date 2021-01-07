import React, { useState, useEffect } from "react"
import { Text, Flex, Box } from "rebass"
import { useForm, useFieldArray } from "react-hook-form"

import Modal from "../../../../components/modal"
import Input from "../../../../components/input"
import CurrencyInput from "../../../../components/currency-input"
import Button from "../../../../components/button"

import useMedusa from "../../../../hooks/use-medusa"

const VariantEditor = ({ variant, options, onSubmit, onDelete, onClick }) => {
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
        value: v,
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
      currency_code: currency,
    }

    setPrices(newPrices)
  }

  const handlePriceChange = (index, e) => {
    const element = e.target
    const value = element.value

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
      },
    ]

    setPrices(newPrices)
  }

  const handleSave = data => {
    data.prices = prices.map(({ currency_code, region_id, amount }) => ({
      currency_code,
      region_id,
      amount: parseFloat(amount),
    }))
    onSubmit(data)
  }

  return (
    <Modal onClick={onClick}>
      <Modal.Body as="form" onSubmit={handleSubmit(handleSave)}>
        <Modal.Header>
          <Text>Edit Variant</Text>
        </Modal.Header>
        <Modal.Content flexDirection="column">
          <Box mb={2}>
            <Input
              mt={2}
              mb={3}
              label="Title"
              name="title"
              ref={register}
              boldLabel={true}
            />
          </Box>
          <Box mb={2}>
            <Text fontSize={2} mb={3}>
              Options
            </Text>
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
          </Box>
          <Box mb={2}>
            <Text mb={3}>Prices</Text>
            {prices.map((p, index) => (
              <Flex mb={3} key={`${p.currency_code}${index}`}>
                <CurrencyInput
                  edit={p.edit}
                  currency={p.currency_code.toUpperCase()}
                  currencyOptions={currencyOptions}
                  value={p.amount}
                  onCurrencySelected={currency =>
                    handleCurrencySelected(index, currency)
                  }
                  onChange={e => handlePriceChange(index, e)}
                />
                <Button
                  ml={2}
                  onClick={() => removePrice(index)}
                  variant="primary"
                >
                  Remove
                </Button>
              </Flex>
            ))}
            {currencyOptions.length !== prices.length && (
              <Flex mb={3}>
                <Button onClick={addPrice} variant="primary">
                  + Add a price
                </Button>
              </Flex>
            )}
          </Box>
          <Box mb={2}>
            <Text mb={3}>Stock & Inventory</Text>
            <Input
              mb={3}
              label="SKU"
              name="sku"
              boldLabel={true}
              ref={register}
            />
            <Input
              mb={3}
              label="EAN"
              name="ean"
              boldLabel={true}
              ref={register}
            />
            <Input
              mb={3}
              label="Inventory"
              name="inventory_quantity"
              type="number"
              boldLabel={true}
              ref={register}
            />
          </Box>
          <Box>
            <Text mb={3}>Danger Zone</Text>
            <Button onClick={onDelete} variant="danger">
              Delete variant
            </Button>
          </Box>
        </Modal.Content>
        <Modal.Footer justifyContent="flex-end">
          <Button type="submit" variant="primary">
            Close
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default VariantEditor
