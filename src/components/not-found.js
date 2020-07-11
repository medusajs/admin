import React from "react"
import styled from "@emotion/styled"
import Card from "./card"
import { Text, Flex, Box } from "rebass"
import Typography from "./typography"

const StyledText = styled(Text)`
  ${Typography.Large};
`

const NotFound = ({}) => {
  return (
    <Card>
      <Card.Body px={3} height="200px">
        <Flex width={1} alignItems="center" justifyContent="center">
          <Box mb={3}>
            <StyledText mt="auto">Sorry, something went wrong</StyledText>
          </Box>
        </Flex>
      </Card.Body>
    </Card>
  )
}

export default NotFound
