import React from "react"
import { Flex, Text, Box } from "rebass"
import { navigate } from "gatsby"

import useMedusa from "../../../hooks/use-medusa"
import Card from "../../../components/card"
import Button from "../../../components/button"
import Spinner from "../../../components/spinner"

const ReturnReasons = () => {
  const { return_reasons, isLoading } = useMedusa("returnReasons")

  return (
    <Flex flexDirection="column" pb={5} pt={5}>
      <Card px={0}>
        <Flex>
          <Text mb={3} fontSize={20} fontWeight="bold">
            Return Reasons
          </Text>
          <Box ml="auto" />
          <Button
            variant="primary"
            onClick={() => navigate("/a/settings/return-reasons/new")}
          >
            + Add Return Reason
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
            return_reasons.map(r => (
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
                    {r.label}
                  </Box>
                  <Box width={1} mt={1}>
                    <Text color="gray">Value: {r.value}</Text>
                    <Text color="gray">{r.description}</Text>
                  </Box>
                </Box>
                <Box>
                  <Button
                    variant="primary"
                    onClick={() =>
                      navigate(`/a/settings/return-reasons/${r.id}`)
                    }
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

export default ReturnReasons
