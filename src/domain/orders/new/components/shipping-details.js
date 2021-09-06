import React, { useEffect, useState } from "react"
import { Box, Flex, Text } from "rebass"
import styled from "@emotion/styled"
import qs from "query-string"
import { ReactCreatableSelect } from "../../../../components/react-select"
import Medusa from "../../../../services/api"
import _ from "lodash"
import Spinner from "../../../../components/spinner"
import Button from "../../../../components/button"
import AddressForm from "../../../../components/address-form"

const AddressContainer = styled(Flex)`
  ${props =>
    props.selected &&
    `
  box-shadow: rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
  rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(60, 66, 87, 0.16) 0px 0px 0px 1px,
  rgba(0, 0, 0, 0) 0px 0px 0px 0px, rgba(0, 0, 0, 0) 0px 0px 0px 0px,
  rgba(0, 0, 0, 0) 0px 0px 0px 0px;
  border-radius: 5px;
  `}
`

const ShippingDetails = ({ customerAddresses, setCustomerAddresses, form }) => {
  const [addNew, setAddNew] = useState(false)
  const [fetchingAddresses, setFetchingAddresses] = useState(false)

  const {
    shipping,
    customer: selectedCustomer,
    region,
    requireShipping,
  } = form.watch(["shipping", "customer", "region", "requireShipping"])

  const debouncedFetch = _.debounce((val, callback) => {
    const prepared = qs.stringify(
      {
        q: val,
        offset: 0,
        limit: 10,
      },
      { skipNull: true, skipEmptyString: true }
    )

    Medusa.customers
      .list(`?${prepared}`)
      .then(({ data }) => {
        const result = data.customers.map(({ id, email }) => ({
          label: email,
          value: id,
        }))

        return callback(result)
      })
      .catch((error) => callback(error, null))
  }, 500)

  const onCustomerSelect = async val => {
    if (!val) {
      form.setValue("customer", "")
      form.setValue("customerId", "")
      setCustomerAddresses([])
      return
    }

    form.setValue("customer", val)
    form.setValue("email", val.label)
    form.setValue("customerId", val.value)

    if (requireShipping) {
      setFetchingAddresses(true)
      await Medusa.customers
        .retrieve(val.value)
        .then(({ data }) => {
          const countries = region.countries.map(({ iso_2 }) => iso_2)
          const inRegion = data.customer.shipping_addresses.filter(sa =>
            countries.includes(sa.country_code)
          )

          if (inRegion) {
            setAddNew(false)
          }
          setCustomerAddresses(inRegion)
        })
        .catch(_ => setCustomerAddresses([]))
      setFetchingAddresses(false)
    }
    console.log(selectedCustomer)
  }

  const onCustomerCreate = val => {
    setCustomerAddresses([])
    setAddNew(true)
    form.setValue("email", val)
    form.setValue("customer", { label: val, value: "" })
  }

  const onCreateNew = () => {
    form.setValue("shipping", {})
    setAddNew(true)
  }

  return (
    <Flex
      flexDirection="column"
      minHeight={!requireShipping ? "200px" : "400px"}
    >
      <Text fontSize={1} mb={2} fontWeight="600">
        Customer and shipping details
      </Text>
      <Text fontSize={1} mb={2}>
        Find or create a customer
      </Text>
      <ReactCreatableSelect
        cacheOptions={true}
        isClearable={true}
        placeholder="Search for customer"
        value={selectedCustomer}
        onChange={val => onCustomerSelect(val)}
        onCreateOption={val => onCustomerCreate(val)}
        loadOptions={debouncedFetch}
      />
      {!requireShipping && (
        <Text fontStyle="italic" fontSize={1} mt={2} color="#a2a1a1">
          To add shipping address, the order should require shipping
        </Text>
      )}
      {requireShipping &&
        (fetchingAddresses ? (
          <Flex flexDirection="column" alignItems="center">
            <Box height="50px" width="50px" mt="15%">
              <Spinner dark />
            </Box>
          </Flex>
        ) : customerAddresses.length && !addNew ? (
          <Flex mt={2} flexDirection="column">
            <Text fontSize={1} mb={2}>
              Choose existing addresses
            </Text>
            {customerAddresses.map((sa, i) => (
              <AddressContainer
                flexDirection="column"
                key={i}
                p={2}
                selected={shipping && sa.id === shipping.id}
                onClick={() => {
                  form.setValue("shipping", sa)
                  form.setValue("billing", sa)
                }}
              >
                <Flex>
                  <Text fontSize="12px" mr={3}>
                    {sa.first_name} {sa.last_name}
                  </Text>
                  <Text fontSize="12px">
                    {sa.address_1}, {sa.address_2} {sa.postal_code} {sa.city}{" "}
                    {sa.country_code.toUpperCase()}
                  </Text>
                </Flex>
              </AddressContainer>
            ))}
            <Button mt={3} variant="primary" onClick={onCreateNew}>
              Create new
            </Button>
          </Flex>
        ) : (
          <Flex flexDirection="column" pt={3}>
            <AddressForm
              allowedCountries={region.countries?.map(c => c.iso_2) || []}
              address={shipping}
              form={form}
              type="shipping"
            />
          </Flex>
        ))}
    </Flex>
  )
}

export default ShippingDetails
