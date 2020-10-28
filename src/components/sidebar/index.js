import React from "react"
import { Flex, Box, Text } from "rebass"
import { Link } from "gatsby"
import styled from "@emotion/styled"
import { Container, InlineLogoContainer, LogoContainer } from "./elements"
import { ReactComponent as Settings } from "../../assets/svg/settings.svg"
import { ReactComponent as Orders } from "../../assets/svg/orders.svg"
import { ReactComponent as Products } from "../../assets/svg/products.svg"
import { ReactComponent as Customers } from "../../assets/svg/customers.svg"
import { ReactComponent as Discounts } from "../../assets/svg/discounts.svg"
import { ReactComponent as Logo } from "../../assets/svg/logo.svg"
import { ReactComponent as GiftCard } from "../../assets/svg/gift-card.svg"
import { ReactComponent as LogoInline } from "../../assets/svg/logo-horizontal.svg"

const MuteLink = styled(Link)`
  text-decoration: none;
  color: inherit;
`

const StyledLink = ({ to, children, ...rest }) => (
  <Box {...rest}>
    <MuteLink to={to}>{children}</MuteLink>
  </Box>
)

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
        <Flex py={1} alignItems="center">
          <Orders />
          <StyledLink ml={2} variant="nav" to="/a/orders">
            Orders
          </StyledLink>
        </Flex>
        <Flex py={1} alignItems="center">
          <Products />
          <StyledLink ml={2} variant="nav" to="/a/products">
            Products
          </StyledLink>
        </Flex>
        <Flex py={1} alignItems="center">
          <Customers />
          <StyledLink ml={2} variant="nav" to="/a/customers">
            Customers
          </StyledLink>
        </Flex>
        <Flex py={1} alignItems="center">
          <Discounts />
          <StyledLink ml={2} variant="nav" to="/a/discounts">
            Discounts
          </StyledLink>
        </Flex>
        <Flex py={1} alignItems="center">
          <GiftCard />
          <StyledLink ml={2} variant="nav" to="/a/gift-cards">
            Gift Cards
          </StyledLink>
        </Flex>
      </Flex>
      <Flex mx={-1} alignItems="center" justifyContent="space-between ">
        <InlineLogoContainer mx={1}>
          <LogoInline height={10} />
        </InlineLogoContainer>
        <InlineLogoContainer mx={1}>
          <StyledLink variant="nav" to="/a/settings">
            <Settings />
          </StyledLink>
        </InlineLogoContainer>
      </Flex>
    </Container>
  )
}

export default Sidebar
