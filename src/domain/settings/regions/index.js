import React, { useEffect } from "react"
import { Flex, Text, Box } from "rebass"
import { useForm } from "react-hook-form"
import { navigate } from "gatsby"

import useMedusa from "../../../hooks/use-medusa"
import Input from "../../../components/input"
import Card from "../../../components/card"
import Button from "../../../components/button"
import Spinner from "../../../components/spinner"

const Regions = () => {
  const { regions, isLoading } = useMedusa("regions")

  return (
    <Flex flexDirection="column">
      <Card>
        <Card.Header
          action={{
            label: "+ Add region",
            onClick: () => navigate("a/settings/regions/new"),
          }}
        >
          Regions
        </Card.Header>
        <Card.Body py={0} flexDirection="column">
          {isLoading ? (
            <Spinner />
          ) : (
            regions.map(r => (
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
                  <Box width={1}>
                    {r.name} ({r.countries.join(", ")})
                  </Box>
                  <Box width={1} mt={1}>
                    <Text color="gray">
                      Payment providers:{" "}
                      {r.payment_providers.join(", ") || "not configured"}
                    </Text>
                    <Text color="gray">
                      Fulfillment providers:{" "}
                      {r.fulfillment_providers.join(", ") || "not configured"}
                    </Text>
                  </Box>
                </Box>
                <Box>
                  <Button
                    variant="primary"
                    onClick={() => navigate(`a/settings/regions/${r._id}`)}
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
