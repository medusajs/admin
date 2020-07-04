import React, { useState, useEffect } from "react"
import { Text, Flex, Box } from "rebass"
import { useForm, useFieldArray } from "react-hook-form"

import Modal from "../../../../components/modal"
import Input from "../../../../components/input"
import CurrencyInput from "../../../../components/currency-input"
import Button from "../../../../components/button"

import useMedusa from "../../../../hooks/use-medusa"

const NewOption = ({ options, onSubmit, onDelete, onClick }) => {
  const { register, reset, handleSubmit } = useForm()

  useEffect(() => {
    reset({ options })
  }, [options])

  return (
    <Modal onClick={onClick}>
      <Modal.Body as="form" onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header>
          <Text>Add Option</Text>
        </Modal.Header>
        <Modal.Content flexDirection="column">
          {options.map((o, index) => (
            <Flex key={o.option_id}>
              <Input
                mb={3}
                label="Title"
                name={`options.${index}.option_title`}
                ref={register}
              />
              <Button variant="primary">Remove</Button>
            </Flex>
          ))}
        </Modal.Content>
        <Modal.Footer justifyContent="flex-end">
          <Button type="submit" variant="primary">
            Create Option
          </Button>
        </Modal.Footer>
      </Modal.Body>
    </Modal>
  )
}

export default NewOption
