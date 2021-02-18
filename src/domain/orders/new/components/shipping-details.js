import React, { useState } from "react"
import Input, { StyledLabel } from "../../../../components/input"
import { Box, Flex, Text } from "rebass"
import styled from "@emotion/styled"
import qs from "query-string"
import Dropdown from "../../../../components/dropdown"
import AsyncCreatableSelect from "react-select/async-creatable"
import Select from "react-select"
import Medusa from "../../../../services/api"
import _ from "lodash"
import Spinner from "../../../../components/spinner"
import Button from "../../../../components/button"
import { Label } from "@rebass/forms"

const StyledCreatableSelect = styled(AsyncCreatableSelect)`
  font-size: 14px;
  color: #454545;

.css-yk16xz-control 
  box-shadow: none;
}
`

const StyledSelect = styled(Select)`
  font-size: 14px;
  color: #454545;
`

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

const ShippingDetails = ({
  setCustomerId,
  setEmail,
  requireShipping,
  region,
  selectedAddress,
  setSelectedAddress,
  customerAddresses,
  setCustomerAddresses,
  setSelectedCustomer,
  selectedCustomer,
  handleAddressChange,
}) => {
  const [addNew, setAddNew] = useState(false)
  const [customerOptions, setCustomerOptions] = useState([])
  const [fetchingAddresses, setFetchingAddresses] = useState(false)

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
      .catch(() => callback(error, null))
  }, 500)

  const onCustomerSelect = async val => {
    if (!val) {
      setSelectedCustomer(null)
      setCustomerAddresses([])
      return
    }
    setSelectedCustomer(val)
    setEmail(val.label)
    setCustomerId(val.value)

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
  }

  const onCustomerCreate = val => {
    setSelectedCustomer({ value: val, label: val })
    setCustomerAddresses([])
    setAddNew(true)
    setEmail(val)
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
      <StyledCreatableSelect
        cacheOptions={true}
        isClearable={true}
        placeholder="Search for customer"
        value={selectedCustomer}
        onChange={val => onCustomerSelect(val)}
        onCreateOption={val => onCustomerCreate(val)}
        options={customerOptions}
        loadOptions={debouncedFetch}
        label="Type"
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
                selected={
                  selectedAddress &&
                  sa.id === selectedAddress.shipping_address.id
                }
                onClick={() => setSelectedAddress({ shipping_address: sa })}
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
            <Button mt={3} variant="primary" onClick={() => setAddNew(true)}>
              Create new
            </Button>
          </Flex>
        ) : (
          <Flex flexDirection="column">
            <Text my={3} fontSize={1}>
              Shipping address
            </Text>
            <Flex
              flexDirection="row"
              mb={3}
              width="100%"
              justifyContent="space-between"
            >
              <Input
                mb={1}
                width="48%"
                onChange={({ currentTarget }) =>
                  handleAddressChange(currentTarget.name, currentTarget.value)
                }
                label="First name"
                required={true}
                name="first_name"
              />
              <Input
                mb={1}
                width="48%"
                onChange={({ currentTarget }) =>
                  handleAddressChange(currentTarget.name, currentTarget.value)
                }
                label="Last name"
                required={true}
                name="last_name"
              />
            </Flex>
            <Flex flexDirection="row" mb={3} width="100%">
              <Input
                mb={1}
                width="100%"
                onChange={({ currentTarget }) =>
                  handleAddressChange(currentTarget.name, currentTarget.value)
                }
                label="Address 1"
                required={true}
                name="address_1"
              />
            </Flex>
            <Flex flexDirection="row" mb={3} width="100%">
              <Input
                mb={1}
                width="100%"
                onChange={({ currentTarget }) =>
                  handleAddressChange(currentTarget.name, currentTarget.value)
                }
                label="Address 2"
                name="address_2"
              />
            </Flex>
            <Flex flexDirection="row" mb={3} width="100%">
              <Input
                mb={1}
                onChange={({ currentTarget }) =>
                  handleAddressChange(currentTarget.name, currentTarget.value)
                }
                width="100%"
                label="Province"
                name="province"
              />
            </Flex>
            <Flex flexDirection="row" mb={3} width="100%">
              <Input
                mb={1}
                onChange={({ currentTarget }) =>
                  handleAddressChange(currentTarget.name, currentTarget.value)
                }
                label="City"
                required={true}
                width="100%"
                name="city"
              />
            </Flex>
            <Flex
              flexDirection="row"
              mb={3}
              width="100%"
              justifyContent="space-between"
            >
              <Input
                mb={1}
                onChange={({ currentTarget }) =>
                  handleAddressChange(currentTarget.name, currentTarget.value)
                }
                label="Postal code"
                width="48%"
                required={true}
                name="postal_code"
              />
              <Flex
                flexDirection="column"
                sx={{ flexBasis: "50%" }}
                height="33px"
              >
                <Label flex={"30% 0 0"}>
                  <StyledLabel required={true}>Country</StyledLabel>
                </Label>
                <StyledSelect
                  height="33px"
                  isClearable={false}
                  placeholder="Select collection..."
                  menuPlacement="top"
                  onChange={val =>
                    handleAddressChange("country_code", val.value)
                  }
                  options={
                    region.countries?.map(c => ({
                      value: c.iso_2,
                      label: c.display_name,
                    })) || []
                  }
                />
              </Flex>
            </Flex>
          </Flex>
        ))}
    </Flex>
  )
}

export default ShippingDetails
