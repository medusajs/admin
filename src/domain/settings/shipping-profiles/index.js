import React from "react"
import { Flex, Text, Box } from "rebass"
import { navigate } from "gatsby"

import useMedusa from "../../../hooks/use-medusa"
import Card from "../../../components/card"
import Button from "../../../components/button"
import Spinner from "../../../components/spinner"

const ShippingProfiles = () => {
  const { shipping_profiles, isLoading } = useMedusa("shippingProfiles")

  return (
    <Flex flexDirection="column">
      <Card>
        <Card.Header
          action={{
            type: "primary",
            label: "+ Add shipping profile",
            onClick: () => navigate("/a/settings/shipping-profiles/new"),
          }}
        >
          Shipping profiles
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
            shipping_profiles.map(sp => (
              <Flex
                key={sp._id}
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
                  <Box width={1}>{sp.name}</Box>
                  <Box width={1} mt={1}>
                    <Text color="gray">
                      {sp.products && sp.products.length > 0 && (
                        <>{`Product(s): ${sp.products.length}`}</>
                      )}
                    </Text>
                    <Text color="gray">
                      {sp.shipping_options &&
                        sp.shipping_options.length > 0 && (
                          <>{`Shipping option(s): ${sp.shipping_options.length}`}</>
                        )}
                    </Text>
                  </Box>
                </Box>
                <Box>
                  <Button
                    variant="primary"
                    onClick={() =>
                      navigate(`/a/settings/shipping-profiles/${sp._id}`)
                    }
                  >
                    Edit
                  </Button>{" "}
                </Box>
              </Flex>
            ))
          )}
        </Card.Body>
      </Card>
    </Flex>
  )
}

export default ShippingProfiles
