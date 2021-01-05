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
        value: v.code,
        label: v.code.toUpperCase(),
      }))
      .filter(o => !prices.find(p => !p.edit && p.code === o.value))
  }

  useEffect(() => {
    if (!value.length && store) {
      setPrices([
        { ...store.default_currency, edit: true, amount: "", sale_amount: "" },
      ])
    } else {
      setPrices([...value])
    }
  }, [value, store])

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

  const handleSalePriceChange = (index, e) => {
    const element = e.target
    const value = element.value

    const newPrices = [...prices]
    newPrices[index] = {
      ...newPrices[index],
      sale_amount: value,
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

  const onSave = () => {
    let cleanPrices = prices.map(p => {
      if (typeof p.amount === "undefined" || p.amount === "") {
        return null
      }

      const clean = {
        amount: parseFloat(p.amount),
        currency_code: p.region_id ? undefined : p.code,
        region_id: p.region_id,
      }

      if (typeof p.sale_amount !== "undefined" && p.sale_price !== "") {
        const amount = parseFloat(p.sale_amount)
        if (!isNaN(amount)) {
          clean.sale_amount = amount
        }
      }

      return clean
    })
    cleanPrices = cleanPrices.filter(Boolean)

    onChange(cleanPrices)
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
        code: currencyOptions[0].value,
        amount: "",
        sale_amount: "",
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
        Edit
      </Button>
      {show && (
        <Modal onClick={() => setShow(!show)} onScroll={handleScroll}>
          <Modal.Body variant="card" onClick={e => e.stopPropagation()}>
            <Modal.Header>
              <Text fontSize={3}>Prices</Text>
            </Modal.Header>
            <Modal.Content flexDirection="column">
              <Flex mb={3}>
                <Text width={150}>Amount</Text>
                <Text ml={3} width={120}>
                  Sale Amount (optional)
                </Text>
              </Flex>
              {prices &&
                prices.map((p, index) => (
                  <Flex mb={3} key={`${p.code}${index}`}>
                    <CurrencyInput
                      height="33px"
                      width={"150px"}
                      placeholder="100.00"
                      edit={p.edit}
                      currency={p.code.toUpperCase()}
                      currencyOptions={currencyOptions}
                      value={p.amount}
                      onCurrencySelected={currency =>
                        handleCurrencySelected(index, currency)
                      }
                      onChange={e => handlePriceChange(index, e)}
                    />
                    <Input
                      width={"120px"}
                      type="number"
                      mx={3}
                      placeholder="50.00"
                      onChange={e => handleSalePriceChange(index, e)}
                      value={p.sale_amount}
                    />
                    <Button
                      onClick={() => removePrice(index)}
                      variant="primary"
                    >
                      Remove
                    </Button>
                  </Flex>
                ))}
              {currencyOptions.length > 1 && (
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
