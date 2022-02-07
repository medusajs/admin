import React, { useState, useEffect } from "react"
import { Text, Flex, Box } from "rebass"
import { useForm, useFieldArray } from "react-hook-form"

import Modal from "../../../components/modal"
import Input from "../../../components/molecules/input"
import Button from "../../../components/button"

import useMedusa from "../../../hooks/use-medusa"
import { StyledMultiSelect } from "."

const ProductSelector = ({
  onClick,
  products,
  selectedProducts,
  setSelectedProducts,
}) => {
  const [variants, setVariants] = useEffect([])
  const { handleSubmit } = useForm({
    defaultValues: {
      toAdd: [],
    },
  })

  const onSubmit = data => {}

  return (
    <Modal onClick={onClick}>
      <Modal.Body as="form" onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header>
          <Text>Browse products</Text>
        </Modal.Header>
        <Modal.Content
          flexDirection="column"
          minHeight="400px"
          minWidth="500px"
        >
          <StyledMultiSelect
            options={
              products &&
              products.map(el => ({
                label: el.title,
                value: el._id,
              }))
            }
            value={selectedProducts}
            onChange={setSelectedProducts}
          />
        </Modal.Content>
        <Modal.Footer justifyContent="flex-end">
          <Button type="submit" variant="primary">
            Save
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default ProductSelector
