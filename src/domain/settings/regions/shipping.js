import React, { useState, useEffect } from "react"
import { Flex, Text, Box } from "rebass"

import useMedusa from "../../../hooks/use-medusa"
import Card from "../../../components/card"
import Button from "../../../components/button"

import NewShipping from "./new-shipping"

const Shipping = ({ region, fulfillmentMethods }) => {
  const [fulfillmentOptions, setFulfillmentOptions] = useState([])
  const [showAddOption, setAddOption] = useState(false)
  const { shipping_options, isLoading } = useMedusa("shippingOptions", {
    search: {
      region_id: region._id,
    },
  })

  useEffect(() => {
    fulfillmentMethods.list(region._id).then(({ data }) => {
      setFulfillmentOptions(data.fulfillment_options)
    })
  }, [])

  const dropdownOptions = [
    {
      label: "Add option...",
      onClick: () => setAddOption(true),
    },
  ]

  return (
    <>
      <Card>
        <Card.Header dropdownOptions={dropdownOptions}>
          Shipping Options
        </Card.Header>
        <Card.Body flexDirection="column">
          {shipping_options.map(option => (
            <Flex px={3}>{option.name}</Flex>
          ))}
        </Card.Body>
        <Card.Footer px={3} justifyContent="flex-end">
          <Button type="submit" variant="primary">
            Save
          </Button>
        </Card.Footer>
      </Card>
      {showAddOption && (
        <NewShipping
          onClick={() => setAddOption(false)}
          region={region}
          fulfillmentOptions={fulfillmentOptions}
        />
      )}
    </>
  )
}

export default Shipping
