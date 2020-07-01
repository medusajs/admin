import React, { useEffect, useState } from "react"
import { Text, Flex, Box } from "rebass"

import VariantGrid from "../../../../components/variant-grid"
import Button from "../../../../components/button"
import Card from "../../../../components/card"
import Input from "../../../../components/input"
import TextArea from "../../../../components/textarea"
import Spinner from "../../../../components/spinner"

const Variants = ({ product, isLoading }) => {
  const [variants, setVariants] = useState([])

  useEffect(() => {
    if (isLoading) return
    setVariants(product.variants)
  }, [product, isLoading])

  const dropdownOptions = [
    { label: "Add option...", onClick: () => console.log("New option") },
  ]

  const handleSubmit = e => {
    e.preventDefault()
    // TODO: Hit the server
  }

  return (
    <Card as="form" onSubmit={handleSubmit}>
      <Card.Header dropdownOptions={dropdownOptions}>Variants</Card.Header>
      <Card.Body px={3}>
        {isLoading ? (
          <Spinner />
        ) : (
          <Flex width={1} flexDirection={"column"}>
            <VariantGrid
              edit
              product={product}
              variants={variants}
              onChange={vs => setVariants(vs)}
            />
          </Flex>
        )}
      </Card.Body>
      <Card.Footer px={3} justifyContent="flex-end">
        <Button type="submit">Save</Button>
      </Card.Footer>
    </Card>
  )
}

export default Variants
