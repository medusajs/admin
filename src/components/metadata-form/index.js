import React, { useState } from "react"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
import { Box, Flex, Text } from "rebass"
import Button from "../button"
import Card from "../card"
import Input from "../input"
import { get } from "lodash"

// TODO: Filtering out null keys until Medusa Core update, remove this after
const filterParentMetadata = parent => {
  const filteredMetadata = Object.entries(parent.metadata).reduce(
    (prev, [key, value]) => (value === null ? prev : { ...prev, [key]: value }),
    {}
  )

  return filteredMetadata
}

const initializeFormFromParent = parent => {
  if (!parent.metadata) return { metadata: [{ key: "", value: "" }] }

  const metadataEntries = Object.entries(filterParentMetadata(parent))
  const metadata = [
    ...metadataEntries.map(([key, value]) => ({
      key,
      value,
    })),
    { key: "", value: "" },
  ]

  return { metadata }
}

const nullifyInitialState = initialValues => {
  const nullifiedValues = Object.entries(initialValues || {}).reduce(
    (acc, [key, value]) => ({ ...acc, [key]: null }),
    {}
  )

  return nullifiedValues
}

const formatData = (initialValues, { metadata }) => {
  return {
    metadata: metadata.reduce((acc, { key, value }) => {
      if (!key) return acc

      acc[key] = value ? value : null
      return acc
    }, nullifyInitialState(initialValues)),
  }
}

const WatchInput = ({
  name,
  index,
  control,
  fields,
  register,
  clearErrors,
  ...props
}) => {
  const controlName = `metadata.${index}.${name}`
  const value = useWatch({
    control,
    name: controlName,
  })

  return (
    <>
      <Input
        {...props}
        {...register(controlName, {
          required: index === 0 || index !== fields.length - 1 ? true : false,
        })}
        placeholder={name}
        boldLabel={"true"}
        defaultValue={value}
        onChange={e => {
          clearErrors(controlName)
          control.setValue(controlName, e.target.value)
        }}
      />
    </>
  )
}

const MetadataForm = ({ parent, onSubmit }) => {
  const {
    control,
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
    clearErrors,
  } = useForm({
    defaultValues: initializeFormFromParent(parent),
    shouldUnregister: true,
  })

  const [initialValues, setInitialValues] = useState(
    parent.metadata ? filterParentMetadata(parent) : {}
  )

  const { fields, append, remove } = useFieldArray({
    control,
    name: "metadata",
  })

  const watchFieldArray = watch("metadata")
  const controlledFields = fields.map((field, index) => {
    return {
      ...field,
      ...watchFieldArray[index],
    }
  })

  const submitHandler = () => {
    const formattedData = formatData(initialValues, {
      metadata: controlledFields,
    })
    setInitialValues(formattedData.metadata)
    onSubmit(formattedData)
  }

  const appendSubmitHandler = () => {
    submitHandler()
    append({ key: "", value: "" })
  }

  const clearSubmitHandler = () => {
    reset({ metadata: [{ key: "", value: "" }] })
    submitHandler()
  }

  return (
    <Card mb={2} as="form">
      <Card.Header>Metadata</Card.Header>
      <Card.Body px={3} flexDirection="column">
        <Box maxWidth={800} mb={4}>
          {controlledFields.map((field, index) => {
            return (
              <>
                <Flex key={field.id} mb={3}>
                  <Box mr={4}>
                    <WatchInput
                      index={index}
                      name="key"
                      fields={controlledFields}
                      control={control}
                      register={register}
                      clearErrors={clearErrors}
                    />
                  </Box>
                  <Box mr={4}>
                    <WatchInput
                      index={index}
                      fields={controlledFields}
                      name="value"
                      control={control}
                      register={register}
                      clearErrors={clearErrors}
                    />
                  </Box>
                  {index === controlledFields.length - 1 && (
                    <>
                      <Button onClick={handleSubmit(appendSubmitHandler)}>
                        Add
                      </Button>
                      {controlledFields.length === 1 &&
                        (field.key || field.value) && (
                          <Button
                            ml={2}
                            variant="danger"
                            onClick={handleSubmit(clearSubmitHandler)}
                          >
                            clear
                          </Button>
                        )}
                    </>
                  )}
                  {index < controlledFields.length - 1 && (
                    <Button
                      variant="danger"
                      onClick={() => {
                        controlledFields.splice(index, 1)
                        reset({ metadata: controlledFields })
                        remove(index)
                        handleSubmit(submitHandler)()
                      }}
                    >
                      Remove
                    </Button>
                  )}
                </Flex>
                {(get(errors, `metadata.${index}.key`) ||
                  get(errors, `metadata.${index}.value`)) && (
                  <Text mt={-2} mb={3}>
                    Please enter both a key and a value.
                  </Text>
                )}
              </>
            )
          })}
        </Box>
      </Card.Body>
    </Card>
  )
}

export default MetadataForm
