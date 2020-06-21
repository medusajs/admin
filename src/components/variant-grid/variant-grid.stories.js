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

const Container = () => {
  const [variants, setVariants] = useState(initial)
  return <VariantGrid variants={variants} onChange={vs => setVariants(vs)} />
}

export const default_ = () => <Container />
