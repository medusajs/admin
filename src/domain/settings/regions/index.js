import React, { useEffect } from "react"
import { Flex, Text, Box } from "rebass"
import { useForm } from "react-hook-form"
import { navigate } from "gatsby"

import useMedusa from "../../../hooks/use-medusa"
import Input from "../../../components/input"
import Card from "../../../components/card"
import Button from "../../../components/button"
import Spinner from "../../../components/spinner"
import paymentProvidersMapper from "../../../utils/payment-providers-mapper"
import fulfillmentProvidersMapper from "../../../utils/fulfillment-providers.mapper"

const Regions = () => {
  const { regions, isLoading } = useMedusa("regions")

  return (
    <Flex flexDirection="column" pb={5} pt={5}>
      <Card px={0}>
        <Flex>
          <Text mb={3} fontSize={20} fontWeight="bold">
            Regions
          </Text>
          <Box ml="auto" />
          <Button
            variant="primary"
            onClick={() => navigate("/a/settings/regions/new")}
          >
            + Add region
          </Button>
        </Flex>
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
            regions.map(r => (
              <Flex
                key={r.id}
                py={3}
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
                  <Box
                    width={1}
                    maxWidth="400px"
                    fontWeight="500"
                    sx={{
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                    }}
                  >
                    {r.name} ({r.countries.map(c => c.display_name).join(", ")})
                  </Box>
                  <Box width={1} mt={1}>
                    <Text color="gray">
                      Payment providers:{" "}
                      {r.payment_providers
                        .map(pp => paymentProvidersMapper(pp.id).label)
                        .join(", ") || "not configured"}
                    </Text>
                    <Text color="gray">
                      Fulfillment providers:{" "}
                      {r.fulfillment_providers
                        .map(fp => fulfillmentProvidersMapper(fp.id).label)
                        .join(", ") || "not configured"}
                    </Text>
                  </Box>
                </Box>
                <Box>
                  <Button
                    variant="primary"
                    onClick={() => navigate(`/a/settings/regions/${r.id}`)}
                  >
                    Edit
                  </Button>
                </Box>
              </Flex>
            ))
          )}
        </Card.Body>
      </Card>
    </Flex>
  )
}

export default Regions
