import React, { useState } from "react"
import Input from "../../../../components/input"
import { Box, Flex, Text } from "rebass"
import styled from "@emotion/styled"
import qs from "query-string"
import Dropdown from "../../../../components/dropdown"
import AsyncCreatableSelect from "react-select/async-creatable"
import Medusa from "../../../../services/api"
import _ from "lodash"
import Spinner from "../../../../components/spinner"
import Button from "../../../../components/button"
import { Checkbox, Label } from "@rebass/forms"

const StyledCreatableSelect = styled(AsyncCreatableSelect)`
  font-size: 14px;
  color: #454545;

.css-yk16xz-control 
  box-shadow: none;
}
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

const Billing = ({ register, requireShipping }) => {
  const [useShipping, setUseShipping] = useState(requireShipping)

  return (
    <Flex flexDirection="column" minHeight={"400px"}>
      <Flex flexDirection="column">
        <Text mb={3} fontSize={1} fontWeight="600">
          Billing address
        </Text>
        {requireShipping && (
          <Flex flexDirection="column" minHeight="75px">
            <Label width={"200px"} p={2} fontSize={1}>
              <Checkbox
                id="true"
                name="requires_shipping"
                value="true"
                checked={useShipping}
                onChange={() => setUseShipping(!useShipping)}
              />
              Use same as shipping
            </Label>
          </Flex>
        )}
        {!useShipping && (
          <>
            <Flex
              flexDirection="row"
              mb={3}
              width="100%"
              justifyContent="space-between"
            >
              <Input
                mb={1}
                width="48%"
                ref={register}
                label="First name"
                required={true}
                name="billing_address.first_name"
              />
              <Input
                mb={1}
                width="48%"
                ref={register}
                label="Last name"
                required={true}
                name="billing_address.last_name"
              />
            </Flex>
            <Flex flexDirection="row" mb={3} width="100%">
              <Input
                mb={1}
                width="100%"
                ref={register}
                label="Address 1"
                required={true}
                name="billing_address.address_1"
              />
            </Flex>
            <Flex flexDirection="row" mb={3} width="100%">
              <Input
                mb={1}
                width="100%"
                ref={register}
                label="Address 2"
                name="billing_address.address_2"
              />
            </Flex>
            <Flex flexDirection="row" mb={3} width="100%">
              <Input
                mb={1}
                ref={register}
                width="100%"
                label="Province"
                name="billing_address.province"
              />
            </Flex>
            <Flex flexDirection="row" mb={3} width="100%">
              <Input
                mb={1}
                ref={register}
                label="City"
                required={true}
                width="100%"
                name="billing_address.city"
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
                ref={register}
                label="Postal code"
                width="48%"
                required={true}
                name="billing_address.postal_code"
              />
              <Input
                mb={1}
                ref={register}
                label="Country code"
                required={true}
                width="48%"
                name="billing_address.country_code"
              />
            </Flex>
          </>
        )}
      </Flex>
    </Flex>
  )
}

export default Billing
