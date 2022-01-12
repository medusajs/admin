import React, { useEffect, useState } from "react"
import { Box, Flex, Text } from "rebass"
import Badge from "../../../components/badge"
import Button from "../../../components/button"
import PlusIcon from "../../../components/fundamentals/icons/plus-icon"
import Actionables from "../../../components/molecules/actionables"
import Spinner from "../../../components/spinner"
import useMedusa from "../../../hooks/use-medusa"
import Medusa from "../../../services/api"
import { getErrorMessage } from "../../../utils/error-messages"
import EditShipping from "./edit-shipping"
import NewShipping from "./new-shipping"

const Shipping = ({ region, fulfillmentMethods }) => {
  const [editOption, setEditOption] = useState(null)
  const [fulfillmentOptions, setFulfillmentOptions] = useState([])
  const [showAddOption, setAddOption] = useState(false)
  const [showAddReturnOption, setAddReturnOption] = useState(false)
  const { shipping_options, refresh, isLoading, toaster } = useMedusa(
    "shippingOptions",
    {
      search: {
        region_id: region.id,
      },
    }
  )

  useEffect(() => {
    Medusa.regions.fulfillmentOptions.list(region.id).then(({ data }) => {
      setFulfillmentOptions(data.fulfillment_options)
    })
  }, [])

  const handleShippingUpdated = () => {
    refresh({
      search: {
        region_id: region.id,
      },
    })
      .then(() => toaster("Successfully updated shipping options", "success"))
      .catch(error => toaster(getErrorMessage(error), "error"))
  }

  const outboundOptions = [
    {
      icon: <PlusIcon />,
      label: "Add option",
      onClick: () => setAddOption(true),
    },
  ]

  const inboundDropdownOptions = [
    {
      icon: <PlusIcon />,
      label: "Add return",
      onClick: () => setAddReturnOption(true),
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

  const outbound = []
  const inbound = []
  if (!isLoading) {
    for (const o of shipping_options) {
      if (o.is_return) {
        inbound.push(o)
      } else {
        outbound.push(o)
      }
    }
  }

  return (
    <>
      <div>
        <div className="flex items-center justify-between">
          <h2 className="inter-base-semibold">Shipping Options</h2>
          <Actionables actions={outboundOptions} />
        </div>
        <div className="flex flex-col">
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
            outbound.map(option => (
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
                    {option.name} {option.data.name && `(${option.data.name})`}
                    {option.admin_only && (
                      <Badge bg="#e3e8ee" color="#4f566b" ml={2}>
                        Not on website
                      </Badge>
                    )}
                  </Text>
                  <Text>
                    {prettify(option.price_type)}
                    {option.amount !== undefined &&
                      ` — ${
                        option.amount / 100
                      } ${region.currency_code.toUpperCase()}`}
                  </Text>
                </Box>

                <Button variant="primary" onClick={() => setEditOption(option)}>
                  Edit
                </Button>
              </Flex>
            ))
          )}
        </div>
      </div>
      <div>
        <div className="flex items-center justify-between">
          <h2 className="inter-base-semibold">Return Shipping Options</h2>
          <Actionables actions={inboundDropdownOptions} />
        </div>
        <div className="flex flex-col">
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
          ) : inbound && inbound.length ? (
            inbound.map(option => {
              console.log(option)
              return (
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
                      {option.name}{" "}
                      {option.data.name && `(${option.data.name})`}
                    </Text>
                    <Text>
                      {prettify(option.price_type)}
                      {option.amount !== undefined &&
                        ` — ${
                          option.amount / 100
                        } ${region.currency_code.toUpperCase()}`}
                    </Text>
                    <Text>
                      {!!option.requirements
                        ? option.requirements.map(r => {
                            return `Order must have a ${prettify(
                              r.type,
                              false
                            )} of ${region.currency_code.toUpperCase()} ${
                              r.amount / 100
                            }`
                          })
                        : "No requirements"}
                    </Text>
                  </Box>

                  <Button
                    variant="primary"
                    onClick={() => setEditOption(option)}
                  >
                    Edit
                  </Button>
                </Flex>
              )
            })
          ) : null}
        </div>
      </div>
      {editOption && (
        <EditShipping
          shippingOption={editOption}
          onClick={() => setEditOption(null)}
          onDone={handleShippingUpdated}
          region={region}
          fulfillmentOptions={fulfillmentOptions}
        />
      )}
      {(showAddOption || showAddReturnOption) && (
        <NewShipping
          isReturn={showAddReturnOption}
          onClick={() =>
            showAddReturnOption
              ? setAddReturnOption(false)
              : setAddOption(false)
          }
          onCreated={handleShippingUpdated}
          region={region}
          fulfillmentOptions={fulfillmentOptions}
        />
      )}
    </>
  )
}

export default Shipping
