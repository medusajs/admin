import React from "react"
import { Box, Flex } from "rebass"
import Card from "./card"

const NotFound = ({}) => {
  return (
    <Card>
      <Card.Body px={3} height="200px">
        <Flex width={1} alignItems="center" justifyContent="center">
          <Box mb={3}>
            <div mt="auto">Sorry, something went wrong</div>
          </Box>
        </Flex>
      </Card.Body>
    </Card>
  )
}

export default NotFound
