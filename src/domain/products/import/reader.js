import React, { Component, useState } from "react"
import { Box, Flex, Text } from "rebass"
import { CSVReader as CSV } from "react-papaparse"
import _ from "lodash"
import {
  Table,
  TableBody,
  TableDataCell,
  TableHead,
  TableHeaderCell,
  TableHeaderRow,
  TableRow,
} from "../../../components/table"
import styled from "@emotion/styled"

const ALLOWED_PRODUCT_FIELDS = [
  "handle",
  "title",
  "subtitle",
  "description",
  "collection",
  "tags",
  "type",
  "weight",
  "height",
  "length",
  "width",
  "hs_code",
  "origin_country",
  "mid_code",
  "material",
]

const REQUIRED_PRODUCT_FIELDS = ["title", "handle"]

const REQUIRED_VARIANT_FIELDS = ["title"]

const ALLOWED_VARIANT_FIELDS = [
  "title",
  "sku",
  "barcode",
  "ean",
  "upc",
  "inventory_quantity",
  "weight",
  "height",
  "length",
  "width",
  "hs_code",
  "origin_country",
  "mid_code",
  "material",
]

const StyledSeeMoreCell = styled(TableDataCell)`
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`

const BackButton = styled(Text)`
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
`

const CSVReader = ({
  setJson,
  json,
  currencies,
  setErrorMessage,
  errorMessage,
}) => {
  const [selectedVariants, setSelectedVariants] = useState(null)

  const formatPrice = price => {
    const currency = price[0]
    const amount = price[1]

    return {
      currency_code: currency.split("price_")[1],
      amount,
    }
  }

  const formatProducts = groupedProducts => {
    let products = []

    let prod = {}
    for (const [, value] of Object.entries(groupedProducts)) {
      let variants = []

      for (const variant of value) {
        let arr = Object.entries(variant)

        let v = {}

        // Filter out prices (prefixed with price_)
        let [prices, rest] = _.partition(arr, ([key, val]) =>
          key.startsWith("price")
        )

        // Filter out options (prefixed with option_)
        let [options, rest2] = _.partition(rest, ([key, val]) =>
          key.startsWith("option")
        )

        // Filter out variant properties (prefixed with variant_)
        let [vars, rest3] = _.partition(rest2, ([key, val]) =>
          key.startsWith("variant")
        )

        for (const p of Object.values(rest3)) {
          // Check that all product fields are allowed
          if (!ALLOWED_PRODUCT_FIELDS.includes(p[0])) {
            setErrorMessage(
              `An invalid product field: "${p[0]}" has been included in the CSV file`
            )
            setJson(null)
            return
          }

          // Check that all required product fields are present
          if (REQUIRED_PRODUCT_FIELDS.includes(p[0]) && !p[1]) {
            setErrorMessage(
              `A required product field: "${p[0]}" is missing a value`
            )
            setJson(null)
            return
          }
        }

        // Start product construction
        prod = rest3.reduce((acc, [propKey, propVal]) => {
          // If property value is empty, we don't add it
          if (!propVal) {
            return acc
          }

          if (propKey === "tags") {
            acc[propKey] = propVal.split(",")
            return acc
          }
          acc[propKey] = propVal
          return acc
        }, {})

        // Format prices -> { currency_code: "", amount: 42 }
        let pricesArr = []
        for (const p of prices) {
          pricesArr.push(formatPrice(p))
        }

        // Start variant construction
        v = vars.reduce((acc, [propKey, propVal]) => {
          // If property value is empty, we don't add it
          if (!propVal) {
            return acc
          }

          acc[propKey.split("variant_")[1]] = propVal
          return acc
        }, {})

        // Check that all variant fields are allowed
        for (const p of Object.keys(v)) {
          if (!ALLOWED_VARIANT_FIELDS.includes(p)) {
            setErrorMessage(
              `An invalid variant field: "${p}" has been included in the CSV file`
            )
            setJson(null)
            return
          }
        }

        // Format options for both product and variants
        let optionNameArr = []
        let optionValueArr = []
        for (const opt of options) {
          if (opt[1]) {
            optionNameArr.push({ title: opt[0].split("option_")[1] })
            optionValueArr.push({ value: opt[1] })
          }
        }

        // Set variant prices and options
        v["prices"] = pricesArr
        v["options"] = optionValueArr
        // Set product options
        prod["options"] = optionNameArr

        if (v.title) {
          variants.push(v)
        }
      }
      // Add constructed variants to product
      if (variants.length) {
        prod["variants"] = variants
      }
      products.push(prod)
    }

    console.log(products)

    return products
  }

  const parseOption = (option, value) => {
    const bracketRegex = new RegExp(/\[(.*?)\]/)
    const [, name] = bracketRegex.exec(option)

    return { optionName: `option_${name}`, optionValue: value }
  }

  const parsePrice = (curr, price) => {
    const bracketRegex = new RegExp(/\[(.*?)\]/)
    const [, currency] = bracketRegex.exec(curr)

    if (currency && currencies.includes(currency)) {
      return { currency: `price_${currency}`, amount: parseInt(price) }
    }
  }

  const formatData = data => {
    const temp = []

    // Get header values and rows
    const [headers, ...rest] = data

    for (const row of rest) {
      let obj = {}

      for (let i = 0; i < headers.data.length; i++) {
        const header = headers.data[i]
        const headerVal = row.data[i]

        if (header.startsWith("price")) {
          const { currency, amount } = parsePrice(header, headerVal)
          obj[currency] = amount
        } else if (header.startsWith("option")) {
          const { optionName, optionValue } = parseOption(header, headerVal)
          obj[optionName] = optionValue
        } else {
          obj[header] = headerVal
        }
      }

      temp.push(obj)
    }

    const grouped = _.groupBy(temp, "handle")

    return formatProducts(grouped)
  }

  const handleOnDrop = data => {
    setErrorMessage(null)
    const products = formatData(data)
    setJson(products)
  }

  const handleOnError = (err, file, inputElem, reason) => {
    setJson(null)
  }

  const handleOnRemoveFile = data => {
    setJson(null)
  }

  if (selectedVariants) {
    const variantKeys = Object.keys(selectedVariants[0])
    return (
      <Flex justifyContent="center" width="100%" flexDirection="column" px={4}>
        <Flex>
          <Box ml="auto" />
          <BackButton
            onClick={() => setSelectedVariants(null)}
            mb={3}
            fontSize={1}
          >
            Back to products
          </BackButton>
        </Flex>
        <Table>
          <TableHead>
            <TableHeaderRow>
              {variantKeys.map((h, i) => (
                <TableHeaderCell key={i}>{h}</TableHeaderCell>
              ))}
            </TableHeaderRow>
          </TableHead>
          <TableBody>
            {selectedVariants.map((v, i) => {
              return (
                <TableRow key={i} sx={{ cursor: "default" }}>
                  {variantKeys.map((k, i) => {
                    if (k === "prices") {
                      return (
                        <TableDataCell key={i}>
                          {v[k].map(({ currency_code, amount }) => (
                            <>
                              {amount} {currency_code.toUpperCase()},{" "}
                            </>
                          ))}
                        </TableDataCell>
                      )
                    }

                    if (k === "options") {
                      return (
                        <TableDataCell key={i}>
                          {v[k].map(({ value }) => value)?.join(", ") || "-"}
                        </TableDataCell>
                      )
                    }

                    if (!Array.isArray(v[k])) {
                      return <TableDataCell key={i}>{v[k]}</TableDataCell>
                    } else {
                      return <TableDataCell key={i}>-</TableDataCell>
                    }
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </Flex>
    )
  }

  return (
    <Flex justifyContent="center" width="100%" flexDirection="column" px={4}>
      {json && json.length && (
        <Table>
          <TableHead>
            <TableHeaderRow>
              {Object.keys(json[0]).map((h, i) => (
                <TableHeaderCell key={i}>{h}</TableHeaderCell>
              ))}
            </TableHeaderRow>
          </TableHead>
          <TableBody>
            {json.map((p, i) => {
              const keys = Object.keys(json[0])
              return (
                <TableRow key={i} sx={{ cursor: "default" }}>
                  {keys.map((k, i) => {
                    if (k === "variants") {
                      if (p[k]?.length && p[k].every(v => v.title)) {
                        return (
                          <StyledSeeMoreCell
                            key={i}
                            onClick={() => setSelectedVariants(p[k])}
                          >
                            See variants
                          </StyledSeeMoreCell>
                        )
                      } else {
                        return <TableDataCell>-</TableDataCell>
                      }
                    } else if (k === "options") {
                      return (
                        <TableDataCell key={i}>
                          {p[k].map(({ title }) => title)?.join(", ") || "-"}
                        </TableDataCell>
                      )
                    } else if (k === "tags") {
                      return (
                        <TableDataCell key={i}>
                          {p[k]?.join(",") || "-"}
                        </TableDataCell>
                      )
                    } else if (!Array.isArray(p[k])) {
                      return (
                        <TableDataCell key={i}>{p[k] || "-"}</TableDataCell>
                      )
                    } else {
                      return <TableDataCell key={i}>-</TableDataCell>
                    }
                  })}
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      )}
      <Flex width="100%" justifyContent="center" mt={4}>
        <CSV
          styles={{ width: "215px" }}
          onDrop={handleOnDrop}
          onError={handleOnError}
          addRemoveButton
          removeButtonColor="#454b54"
          onRemoveFile={handleOnRemoveFile}
        >
          <Text fontSize={1} fontStyle="italic">
            Drop file or click to upload
          </Text>
        </CSV>
      </Flex>
    </Flex>
  )
}

export default CSVReader
