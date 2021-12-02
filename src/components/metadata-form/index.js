import React from "react"
import { useFieldArray, useForm, useWatch } from "react-hook-form"
import { Box, Flex, Text } from "rebass"
import Button from "../button"
import Card from "../card"
import Input from "../input"
import { get } from "lodash"

const initializeFormFromParent = parent => {
  const metadata = Object.entries(
    parent.metadata || { "": "" }
  ).map(([key, value]) => ({ key, value }))
  return { metadata }
}

const formatData = ({ metadata }) => ({
  metadata: metadata.reduce((acc, { key, value }) => {
    acc[key] = value
    return acc
  }, {}),
})

const WatchInput = ({ name, control, register, clearErrors, ...props }) => {
  const value = useWatch({
    control,
    name,
  })
  return (
    <>
      <Input
        {...props}
        {...register(name, { required: name.includes("0") ? false : true })}
        placeholder="key"
        boldLabel={"true"}
        defaultValue={value}
        onChange={e => {
          clearErrors(name)
          control.setValue(name, e.target.value)
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

  const submitHandler = data => {
    const formattedData = formatData(data)
    onSubmit(formattedData)
  }

  return (
    <Card mb={2} as="form" onSubmit={handleSubmit(submitHandler)}>
      <Card.Header>Metadata</Card.Header>
      <Card.Body px={3} flexDirection="column">
        <Box maxWidth={800} mb={4}>
          {controlledFields.map((field, index) => {
            return (
              <>
                <Flex key={field.id} mb={3}>
                  <Box mr={4}>
                    <WatchInput
                      name={`metadata.${index}.key`}
                      control={control}
                      register={register}
                      clearErrors={clearErrors}
                    />
                  </Box>
                  <Box mr={4}>
                    <WatchInput
                      name={`metadata.${index}.value`}
                      control={control}
                      register={register}
                      clearErrors={clearErrors}
                    />
                  </Box>
                  {index === controlledFields.length - 1 && (
                    <>
                      <Button onClick={() => append({ key: "", value: "" })}>
                        Add
                      </Button>
                      {controlledFields.length === 1 &&
                        (field.key || field.value) && (
                          <Button
                            ml={2}
                            variant="danger"
                            onClick={() =>
                              reset({ metadata: [{ key: "", value: "" }] })
                            }
                          >
                            clear
                          </Button>
                        )}
                    </>
                  )}
                  {index === controlledFields.length - 2 && (
                    <Button
                      variant="danger"
                      onClick={() => {
                        controlledFields.splice(index, 1)
                        reset({ metadata: controlledFields })
                        remove(index)
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

        <Flex justifyContent="flex-end">
          <Button type="submit" variant="deep-blue">
            Save
          </Button>
        </Flex>
      </Card.Body>
    </Card>
  )
}

export default MetadataForm
