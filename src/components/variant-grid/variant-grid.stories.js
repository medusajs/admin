import React, { useState } from "react"
import { storiesOf } from "@storybook/react"

import VariantGrid from "./index"

export default {
  title: `VariantGrid`,
}

const initial = [
  { options: ["a", "1"], sku: "123-42-aa", price: "120" },
  { options: ["a", "2"], sku: "456-42-aa", price: "122" },
  { options: ["b", "1"], sku: "789-42-bb", price: "120" },
  { options: ["b", "2"], sku: "101-42-bb", price: "122" },
]

export const default_ = () => {
  const [variants, setVariants] = useState(initial)
  return <VariantGrid variants={variants} onChange={vs => setVariants(vs)} />
}

const existing = [
  {
    options: [
      {
        option_id: "1",
        value: "a",
      },
      {
        option_id: "2",
        value: "1",
      },
    ],
    sku: "123-42-aa",
    prices: [
      {
        currency_code: "DKK",
        amount: "120",
      },
    ],
  },
  {
    options: [
      {
        option_id: "1",
        value: "a",
      },
      {
        option_id: "2",
        value: "2",
      },
    ],
    sku: "456-42-aa",
    prices: [
      {
        currency_code: "DKK",
        amount: "120",
      },
    ],
  },
  {
    options: [
      {
        option_id: "1",
        value: "b",
      },
      {
        option_id: "2",
        value: "1",
      },
    ],
    sku: "789-42-bb",
    prices: [
      {
        currency_code: "DKK",
        amount: "120",
      },
    ],
  },
  {
    options: [
      {
        option_id: "1",
        value: "b",
      },
      {
        option_id: "2",
        value: "2",
      },
    ],
    sku: "101-42-bb",
    prices: [
      {
        currency_code: "DKK",
        amount: "120",
      },
    ],
  },
]

export const edit = () => {
  const [variants, setVariants] = useState(existing)
  return (
    <VariantGrid
      edit
      product={{
        options: [
          {
            title: "Size",
            _id: "1",
          },
          {
            title: "Material",
            _id: "2",
          },
        ],
      }}
      variants={variants}
      onChange={vs => setVariants(vs)}
    />
  )
}
