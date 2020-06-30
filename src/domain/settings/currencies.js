import React, { useState, useEffect } from "react"
import styled from "@emotion/styled"
import { Box, Flex } from "rebass"

import useMedusa from "../../hooks/use-medusa"
import Select from "../../components/select"
import Card from "../../components/card"
import Button from "../../components/button"
import Spinner from "../../components/spinner"
import Input from "../../components/input"
import TagDropdown from "../../components/tag-dropdown"

import { currencies } from "../../utils/currencies"

const Currency = styled.div`
  display: flex;
  span {
    &:first-of-type {
      flex: 1;
      text-alignment: center;
      padding-right: 5px;
      border-right: 1px solid ${props => props.theme.colors.dark};
    }

    &:last-of-type {
      padding-left: 8px;
      flex: 2;
    }
  }
`

const AccountDetails = () => {
  const [selectedCurrencies, setCurrencies] = useState([])
  const { store, isLoading, addCurrency, removeCurrency } = useMedusa("store")

  useEffect(() => {
    if (isLoading) return
    setCurrencies(store.currencies)
  }, [store])

  const options = Object.keys(currencies).map(k => {
    return {
      symbol: currencies[k].symbol_native,
      value: k,
      code: k,
    }
  })

  const handleChange = currencies => {
    setCurrencies(currencies)
  }

  return (
    <Flex flexDirection={"column"}>
      <Card>
        <Card.Header>Store Currencies</Card.Header>
        <Card.Body px={3}>
          {isLoading ? (
            <Spinner />
          ) : (
            <Flex width={1} flexDirection="column">
              <Box mb={3}>
                <Select
                  label="Default Currency"
                  name="default_currency"
                  value={"USD"}
                  options={options}
                />
              </Box>
              <TagDropdown
                toggleText="Choose currencies"
                values={selectedCurrencies}
                onChange={handleChange}
                options={options}
                optionRender={o => (
                  <Currency>
                    <span>{o.symbol}</span>
                    <span>{o.code}</span>
                  </Currency>
                )}
                valueRender={o => (
                  <Currency>
                    <span>{o.symbol}</span>
                    <span>{o.code}</span>
                  </Currency>
                )}
              />
            </Flex>
          )}
        </Card.Body>
        <Card.Footer mx={3} justifyContent="flex-end">
          <Button type="submit">Save</Button>
        </Card.Footer>
      </Card>
    </Flex>
  )
}

export default AccountDetails
