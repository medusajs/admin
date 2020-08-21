import React, { useEffect, useState } from "react"
import styled from "@emotion/styled"
import { Text, Flex, Box } from "rebass"

import CurrencyInput from "../../currency-input"
import Modal from "../../modal"
import Button from "../../button"
import Input from "../../input"

import useMedusa from "../../../hooks/use-medusa"

const PricesEditor = React.forwardRef(({ onKeyDown, value, onChange }, ref) => {
  const { store, isLoading } = useMedusa("store")

  const [show, setShow] = useState(false)
  const [currencyOptions, setCurrencyOptions] = useState([])
  const [prices, setPrices] = useState([...value])

  const getCurrencyOptions = () => {
    return ((store && store.currencies) || [])
      .map(v => ({
        value: v,
      }))
      .filter(o => !prices.find(p => !p.edit && p.currency_code === o.value))
  }

  useEffect(() => {
    setPrices([...value])
  }, [value])

  useEffect(() => {
    setCurrencyOptions(getCurrencyOptions())
  }, [store, isLoading, prices])

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("keydown", onKeyDown)
      return () => window.removeEventListener("keydown", onKeyDown)
    }
  }, [])

  const handleScroll = e => {
    e.preventDefault()
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

  const onSave = () => {
    onChange(prices)
    setShow(false)
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

  const handleCurrencySelected = (index, currency) => {
    const newPrices = [...prices]
    newPrices[index] = {
      ...newPrices[index],
      currency_code: currency,
    }

    setPrices(newPrices)
  }

  return (
    <>
      <Button ref={ref} variant="primary" onClick={() => setShow(!show)}>
        Update {value.length} prices
      </Button>
      {show && (
        <Modal onClick={() => setShow(!show)} onScroll={handleScroll}>
          <Modal.Body variant="card" onClick={e => e.stopPropagation()}>
            <Modal.Header>
              <Text fontSize={3}>Prices</Text>
            </Modal.Header>
            <Modal.Content flexDirection="column">
              {prices.map((p, index) => (
                <Flex mb={3} key={`${p.currency_code}${index}`}>
                  <CurrencyInput
                    edit={p.edit}
                    currency={p.currency_code}
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
              {!!currencyOptions.length && (
                <Flex>
                  <Button onClick={addPrice} variant="primary">
                    + Add a price
                  </Button>
                </Flex>
              )}
            </Modal.Content>
            <Modal.Footer justifyContent="flex-end">
              <Button onClick={onSave} variant="primary">
                Save
              </Button>
            </Modal.Footer>
          </Modal.Body>
        </Modal>
      )}
    </>
  )
})

export default PricesEditor
