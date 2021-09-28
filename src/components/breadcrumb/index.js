import React from "react"
import { Router } from "@reach/router"
import { Box, Flex, Text } from "rebass"
import { Link, navigate } from "gatsby"

const BreadCrumb = ({ previousRoute, previousBreadCrumb, currentPage }) => {
  return (
    <Flex width={1} sx={{ fontSize: "14px" }}>
      <Text mr={1} color="gray">
        {previousBreadCrumb}
      </Text>
      <Text mr={1} color="gray">
        {" > "}
      </Text>
      <Text color="black"> {currentPage} </Text>
    </Flex>
  )
}

export default BreadCrumb
