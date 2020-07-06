import React, { useState, useEffect } from "react"
import { Flex, Text, Box } from "rebass"

import useMedusa from "../../../hooks/use-medusa"
import Card from "../../../components/card"
import Button from "../../../components/button"
import Spinner from "../../../components/spinner"

import EditShipping from "./edit-shipping"
import NewShipping from "./new-shipping"

const Shipping = ({ region, fulfillmentMethods }) => {
  const [editOption, setEditOption] = useState(null)
  const [fulfillmentOptions, setFulfillmentOptions] = useState([])
  const [showAddOption, setAddOption] = useState(false)
  const { shipping_options, refresh, isLoading } = useMedusa(
    "shippingOptions",
    {
      search: {
        region_id: region._id,
      },
    }
  )

  useEffect(() => {
    fulfillmentMethods.list(region._id).then(({ data }) => {
      setFulfillmentOptions(data.fulfillment_options)
    })
  }, [])

  const handleShippingUpdated = () => {
    refresh()
  }

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
        <Card.Body py={0} flexDirection="column">
          {isLoading ? (
            <Spinner />
          ) : (
            shipping_options.map(option => (
              <Flex
                py={3}
                px={3}
                width={1}
                sx={{
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  borderBottom: "1px solid",
                  borderColor: "muted",
                }}
              >
                {option.name}
                <Button variant="primary" onClick={() => setEditOption(option)}>
                  Edit
                </Button>
              </Flex>
            ))
          )}
        </Card.Body>
      </Card>
      {editOption && (
        <EditShipping
          shippingOption={editOption}
          onClick={() => setEditOption(null)}
          onDone={handleShippingUpdated}
          region={region}
          fulfillmentOptions={fulfillmentOptions}
        />
      )}
      {showAddOption && (
        <NewShipping
          onClick={() => setAddOption(false)}
          onCreated={handleShippingUpdated}
          region={region}
          fulfillmentOptions={fulfillmentOptions}
        />
      )}
    </>
  )
}

export default Shipping
