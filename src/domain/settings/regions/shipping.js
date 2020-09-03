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
  const { shipping_options, refresh, isLoading, toaster } = useMedusa(
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
    refresh({
      search: {
        region_id: region._id,
      },
    })
      .then(() => toaster("Successfully updated shipping options", "success"))
      .catch(() => toaster("Failed to update shipping options", "error"))
  }

  const dropdownOptions = [
    {
      label: "Add option...",
      onClick: () => setAddOption(true),
    },
  ]

  const prettify = (snakeCase, cap = true) => {
    const parts = snakeCase.split("_")
    if (!cap) {
      return parts.join(" ")
    }
    const capParts = parts.map(w => w[0].toUpperCase() + w.slice(1))
    return capParts.join(" ")
  }

  return (
    <>
      <Card>
        <Card.Header dropdownOptions={dropdownOptions}>
          Shipping Options
        </Card.Header>
        <Card.Body py={0} flexDirection="column">
          {isLoading ? (
            <Flex
              flexDirection="column"
              alignItems="center"
              height="100vh"
              mt="auto"
            >
              <Box height="75px" width="75px" mt="50%">
                <Spinner dark />
              </Box>
            </Flex>
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
                <Box>
                  <Text>
                    {option.name} ({option.data.name})
                  </Text>
                  <Text>
                    {prettify(option.price.type)}
                    {option.price.amount !== undefined &&
                      ` — ${region.currency_code} ${option.price.amount}`}
                  </Text>
                  <Text>
                    {!!option.requirements
                      ? option.requirements.map(r => {
                          return `Order must have a ${prettify(
                            r.type,
                            false
                          )} of ${region.currency_code} ${r.value}`
                        })
                      : "No requirements"}
                  </Text>
                </Box>

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
