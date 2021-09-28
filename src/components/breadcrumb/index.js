import React from "react"
import { Router } from "@reach/router"
import { Box, Flex, Text } from "rebass"
import { Link, navigate } from "gatsby"

const BreadCrumb = ({ previousRoute, previousBreadCrumb, currentPage }) => {
  return (
    <Flex width={1} pb={3} sx={{ fontSize: "14px", fontWeight: 400 }}>
      <Text
        mr={1}
        onClick={() => navigate(previousRoute)}
        sx={{ cursor: "pointer" }}
        color="gray"
      >
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
