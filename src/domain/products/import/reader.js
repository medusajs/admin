import React, { Component, useState } from "react"
import { Flex, Text } from "rebass"
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

const CSVReader = ({ setJson, json, currencies }) => {
  const transformToProducts = products => {
    for (const prod of products) {
      const variants = []
    }
  }

  const parsePrice = (curr, price) => {
    const bracketRegex = new RegExp(/\[(.*?)\]/)
    const [, currency] = bracketRegex.exec(curr)

    if (currency && currencies.includes(currency)) {
      return { currency, amount: parseInt(price) }
    } else {
      return { currency, amount: 0 }
    }
  }

  const formatData = data => {
    const temp = []

    const [headers, ...rest] = data

    for (const row of rest) {
      let obj = {}

      for (let i = 0; i < headers.data.length; i++) {
        const header = headers.data[i]
        const headerVal = row.data[i]

        if (header.startsWith("price")) {
          const { currency, amount } = parsePrice(header, headerVal)
          obj[currency] = amount
        } else {
          obj[header] = headerVal
        }
      }

      temp.push(obj)
    }

    const grouped = _.groupBy(temp, "handle")

    const products = transformToProducts(grouped)

    return _.groupBy(temp, "handle")
  }

  const handleOnDrop = data => {
    const formatted = formatData(data)
    console.log(formatted)
    // const toArray = Object.entries(formatted).map(([key, val]) => ({
    //   [key]: val,
    // }))
    // setJson(toArray)
  }

  const handleOnError = (err, file, inputElem, reason) => {
    console.log(err)
  }

  const handleOnRemoveFile = data => {
    setJson(null)
  }

  console.log(json)
  return (
    <Flex justifyContent="center" width="100%">
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
            {/* {json.map((p, i) => {
              return (
                <TableRow key={p.id}>
                  <TableDataCell></TableDataCell>
                  <TableDataCell>{p.title}</TableDataCell>
                  <TableDataCell></TableDataCell>
                </TableRow>
              )
            })} */}
          </TableBody>
        </Table>
      )}
      <CSV
        styles={{ minWidth: "215px" }}
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
  )
}

export default CSVReader
