import React, { useState, useEffect } from "react"
import { Text, Flex, Box } from "rebass"
import { useForm, useFieldArray } from "react-hook-form"

import Modal from "../../../../components/modal"
import Input from "../../../../components/input"
import CurrencyInput from "../../../../components/currency-input"
import Button from "../../../../components/button"

import useMedusa from "../../../../hooks/use-medusa"

const NewOption = ({ options, optionMethods, onDelete, onClick }) => {
  const [toAdd, setToAdd] = useState([])
  const { control, setValue, register, handleSubmit } = useForm({
    defaultValues: {
      options,
      toAdd: [],
    },
  })

  const { fields, remove, append } = useFieldArray({
    control,
    name: "toAdd",
  })

  useEffect(() => {
    options.forEach((o, index) => {
      register({ name: `options[${index}]._id` })
      setValue(`options[${index}]._id`, o._id)
    })
  }, [options])

  const onRemove = id => {
    optionMethods.delete(id)
  }

  const onAddOption = () => {
    append()
  }

  const onSubmit = data => {
    const toAdd = data.toAdd || []
    const options = data.options || []
    Promise.all(
      toAdd.map((o, index) =>
        optionMethods.create(o).then(() => {
          remove(index)
        })
      )
    )
      .then(() => {
        Promise.all(
          options.map(o =>
            optionMethods.update(o._id, {
              title: o.title,
            })
          )
        )
      })
      .then(() => onClick())
  }

  return (
    <Modal onClick={onClick}>
      <Modal.Body as="form" onSubmit={handleSubmit(onSubmit)}>
        <Modal.Header>
          <Text>Add Option</Text>
        </Modal.Header>
        <Modal.Content flexDirection="column">
          {options.map((o, index) => (
            <Flex mb={3} alignItems="flex-end" key={o._id}>
              <Input
                label="Title"
                name={`options[${index}].title`}
                ref={register}
              />
              <Button onClick={() => onRemove(o._id)} variant="primary" ml={3}>
                Remove
              </Button>
            </Flex>
          ))}
          {fields.map((o, index) => (
            <Flex mb={3} alignItems="flex-end" key={o.id}>
              <Input
                label="Title"
                name={`toAdd[${index}].title`}
                ref={register()}
              />
              <Button onClick={() => remove(index)} variant="primary" ml={3}>
                Remove
              </Button>
            </Flex>
          ))}
          <Button variant="primary" onClick={onAddOption}>
            + Add option
          </Button>
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

export default NewOption
