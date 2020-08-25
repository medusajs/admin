import React, { useEffect } from "react"
import { Flex, Text, Box } from "rebass"
import { useForm } from "react-hook-form"
import { navigate } from "gatsby"

import useMedusa from "../../hooks/use-medusa"
import Input from "../../components/input"
import Card from "../../components/card"
import Button from "../../components/button"
import Spinner from "../../components/spinner"

const Apps = () => {
  const { apps, isLoading } = useMedusa("apps")

  return (
    <Flex flexDirection="column">
      <Card>
        <Card.Header>Apps</Card.Header>
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
            apps.map(r => (
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
                  <Box width={1}>{r.display_name}</Box>
                </Box>
                <Box>
                  <Button
                    variant="primary"
                    onClick={() => navigate(`${r.install_url}`)}
                  >
                    Install
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

export default Apps
