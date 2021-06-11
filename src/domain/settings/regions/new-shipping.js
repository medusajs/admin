import React, { useState, useEffect } from "react"
import { Text, Flex, Box } from "rebass"
import { useForm, useFieldArray } from "react-hook-form"

import Modal from "../../../components/modal"
import Input from "../../../components/input"
import CurrencyInput from "../../../components/currency-input"
import Button from "../../../components/button"
import Select from "../../../components/select"
import Spinner from "../../../components/spinner"

import useMedusa from "../../../hooks/use-medusa"
import Medusa from "../../../services/api"
import fulfillmentProvidersMapper from "../../../utils/fulfillment-providers.mapper"
import { Checkbox, Label } from "@rebass/forms"

const NewShipping = ({
  isReturn,
  fulfillmentOptions,
  region,
  onCreated,
  onSubmit,
  onDelete,
  onClick,
}) => {
  const { register, handleSubmit } = useForm()
  const { shipping_profiles, isLoading: isProfilesLoading } = useMedusa(
    "shippingProfiles"
  )
  const [adminOnly, setAdminOnly] = useState(false)

  const handleSave = data => {
    const fOptions = fulfillmentOptions.map(provider => {
      const filtered = provider.options.filter(
        o => !!o.is_return === !!isReturn
      )

      return {
        ...provider,
        options: filtered,
      }
    })

    const [providerIndex, optionIndex] = data.fulfillment_option.split(".")
    const { provider_id, options } = fOptions[providerIndex]

    let reqs = []
    if (data.requirements) {
      reqs = Object.entries(data.requirements).reduce((acc, [key, value]) => {
        if (parseInt(value) && parseInt(value) > 0) {
          acc.push({ type: key, amount: Math.round(value * 100) })
          return acc
        } else {
          return acc
        }
      }, [])
    }

    const payload = {
      name: data.name,
      data: options[optionIndex],
      region_id: region.id,
      profile_id: data.profile_id,
      requirements: reqs,
      price_type: "flat_rate",
      amount: Math.round(data.price.amount * 100),
      is_return: isReturn,
      provider_id,
      admin_only: adminOnly,
    }

    Medusa.shippingOptions.create(payload).then(() => {
      if (onCreated) {
        onCreated()
      }
      onClick()
    })
  }

  const options = fulfillmentOptions.reduce((acc, provider, p) => {
    const filtered = provider.options.filter(o => !!o.is_return === !!isReturn)

    return acc.concat(
      filtered.map((option, o) => ({
        label: `${option.id} via ${
          fulfillmentProvidersMapper(provider.provider_id).label
        }`,
        value: `${p}.${o}`,
      }))
    )
  }, [])

  const profileOptions = isProfilesLoading
    ? []
    : shipping_profiles.map(p => ({
        label: p.name,
        value: p.id,
      }))

  return (
    <Modal onClick={onClick}>
      <Modal.Body as="form" onSubmit={handleSubmit(handleSave)}>
        <Modal.Header>
          <Text>Add Shipping Option</Text>
        </Modal.Header>
        <Modal.Content flexDirection="column">
          <Box mb={3}>
            <Input
              mt={2}
              mb={3}
              label="Name"
              boldLabel={true}
              name="name"
              ref={register({ required: true })}
              required={true}
            />
          </Box>
          <Flex flexDirection="column" minHeight="50px">
            <Label width={"200px"} fontSize={1}>
              <Checkbox
                id="true"
                name="requires_shipping"
                value="true"
                checked={!adminOnly}
                onChange={() => setAdminOnly(!adminOnly)}
              />
              Show on website
            </Label>
          </Flex>
          {!isReturn && (
            <Box mb={4}>
              <Text fontSize={1} fontWeight={300} mb={2} fontWeight="500">
                Shipping profile
              </Text>
              {isProfilesLoading ? (
                <Flex
                  fmlexDirection="column"
                  alignItems="center"
                  height="100vh"
                  mt="auto"
                >
                  <Box height="75px" width="75px" mt="50%">
                    <Spinner dark />
                  </Box>
                </Flex>
              ) : (
                <Select
                  required={true}
                  name="profile_id"
                  options={profileOptions}
                  ref={register({ required: true })}
                />
              )}
            </Box>
          )}
          <Box mb={4}>
            <Text fontSize={1} fontWeight={300} mb={2} fontWeight="500">
              Fulfillment method
            </Text>
            <Select
              required={true}
              name="fulfillment_option"
              options={options}
              ref={register({ required: true })}
            />
          </Box>
          <Box mb={4}>
            <Text
              fontSize={1}
              fontWeight={300}
              mb={2}
              className="required"
              fontWeight="500"
            >
              Price
            </Text>
            <CurrencyInput
              ref={register({ required: true })}
              required={true}
              name={"price.amount"}
              currency={region.currency_code.toUpperCase()}
            />
          </Box>
          {!isReturn && (
            <Flex mb={4} flexDirection="column">
              <Text fontSize={1} fontWeight={300} mb={1} fontWeight="500">
                Requirements
              </Text>
              <Flex justifyContent="space-between" mt={2} width="100%">
                <CurrencyInput
                  inline
                  start={true}
                  width="100%"
                  fontSize="12px"
                  boldLabel={true}
                  label="Min. subtotal"
                  name={`requirements.min_subtotal`}
                  currency={region.currency_code.toUpperCase()}
                  ref={register}
                />
              </Flex>
              <Flex justifyContent="space-between" mt={2} width="100%">
                <CurrencyInput
                  inline
                  width="100%"
                  boldLabel={true}
                  start={true}
                  label="Max. subtotal"
                  fontSize="12px"
                  name={`requirements.max_subtotal`}
                  currency={region.currency_code.toUpperCase()}
                  ref={register}
                />
              </Flex>
            </Flex>
          )}
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

export default NewShipping
