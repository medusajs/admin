import React from "react"
import { Flex, Box, Text, Link } from "rebass"
import { Container, InlineLogoContainer, LogoContainer } from "./elements"
import { ReactComponent as Settings } from "../../assets/svg/settings.svg"
import { ReactComponent as Logo } from "../../assets/svg/logo.svg"
import { ReactComponent as LogoInline } from "../../assets/svg/logo-horizontal.svg"

const Sidebar = ({}) => {
  return (
    <Container fontSize={1} fontFamily={"body"} p={4}>
      <Flex mx={-2} alignItems="center">
        <LogoContainer width={1 / 12} mx={1}>
          <Logo />
        </LogoContainer>
        <Box mx={1}>
          <Text fontWeight="200">Tekla Fabrics</Text>
        </Box>
      </Flex>

      <Flex py={4} mx={-1} flexDirection="column" flex={1}>
        <Flex py={1}>
          <Box mx={1} width={1 / 12}>
            <Settings />
          </Box>
          <Box mx={1}>
            <Link>Orders</Link>
          </Box>
        </Flex>
        <Flex py={1}>
          <Box mx={1} width={1 / 12}>
            <Settings />
          </Box>
          <Box mx={1}>
            <Link>Products</Link>
          </Box>
        </Flex>
        <Flex py={1}>
          <Box mx={1} width={1 / 12}>
            <Settings />
          </Box>
          <Box mx={1}>
            <Link>Customers</Link>
          </Box>
        </Flex>
        <Flex py={1}>
          <Box mx={1} width={1 / 12}>
            <Settings />
          </Box>
          <Box mx={1}>
            <Link>Shipping</Link>
          </Box>
        </Flex>
      </Flex>
      <Flex mx={-1} alignItems="center" justifyContent="space-between ">
        <InlineLogoContainer mx={1}>
          <LogoInline height={10} />
        </InlineLogoContainer>
        <InlineLogoContainer mx={1}>
          <Settings />
        </InlineLogoContainer>
      </Flex>
    </Container>
  )
}

export default Sidebar
