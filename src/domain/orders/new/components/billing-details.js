import React, { useEffect, useState } from "react"
import { Flex, Text } from "rebass"
import _ from "lodash"
import { Checkbox, Label } from "@rebass/forms"
import AddressForm from "../../../../components/address-form"

const Billing = ({ form }) => {
  const [useShipping, setUseShipping] = useState(false)

  const { region, shipping, requireShipping } = form.watch([
    "region",
    "shipping",
    "requireShipping",
  ])

  useEffect(() => {
    if (!useShipping) {
      form.setValue("billing", {})
    }
  }, [useShipping])

  const onUseShipping = () => {
    setUseShipping(!useShipping)
    form.setValue("billing", { ...shipping })
  }

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
                onChange={() => onUseShipping()}
              />
              Use same as shipping
            </Label>
          </Flex>
        )}
        {!useShipping && (
          <Flex flexDirection="column">
            <AddressForm
              allowedCountries={region.countries?.map(c => c.iso_2) || []}
              address={{}}
              form={form}
              type="billing"
            />
          </Flex>
        )}
      </Flex>
    </Flex>
  )
}

export default Billing
