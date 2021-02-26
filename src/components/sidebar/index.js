import React, { useEffect, useState } from "react"
import { Flex, Box, Text } from "rebass"
import { Link, navigate } from "gatsby"
import styled from "@emotion/styled"
import { Container, InlineLogoContainer, LogoContainer } from "./elements"
import { ReactComponent as Settings } from "../../assets/svg/settings.svg"
import { ReactComponent as Orders } from "../../assets/svg/orders.svg"
import { ReactComponent as Products } from "../../assets/svg/products.svg"
import { ReactComponent as Collections } from "../../assets/svg/collection.svg"
import { ReactComponent as Customers } from "../../assets/svg/customers.svg"
import { ReactComponent as Discounts } from "../../assets/svg/discounts.svg"
import { ReactComponent as Logo } from "../../assets/svg/logo.svg"
import { ReactComponent as GiftCard } from "../../assets/svg/gift-card.svg"
import { ReactComponent as LogoInline } from "../../assets/svg/logo-horizontal.svg"
import Medusa from "../../services/api"

const StyledItemContainer = styled(Link)`
  display: flex;
  padding-left: 10px;
  padding-right: 10px;
  margin-bottom: 5px;
  align-items: center;
  border-radius: 5pt;
  cursor: pointer;

  text-decoration: none;
  color: black;
  height: 30px;

  svg {
    max-height: 20px;
    max-width: 20px;
  }

  [fill*="red"] {
    fill: #454545;
  }

  &:hover {
    ${props =>
      !props.active &&
      `
      background-color: #e0e0e059;
    `}
  }

  &.active {
    background-color: #e0e0e0;
  }
`

const Sidebar = ({}) => {
  const [storeName, setStoreName] = useState("")
  const [path, setPath] = useState("")

  const fetchStore = async () => {
    const cache = localStorage.getItem("medusa::cache::store")
    if (cache) {
      setStoreName(cache)
    } else {
      const { data } = await Medusa.store.retrieve(({ data }) => data.store)
      if (data.store) {
        localStorage.setItem("medusa::cache::store", data.store.name)
        setStoreName(data.store.name)
      }
    }
  }

  const handleOnClick = async route => {
    navigate(`/a/${route}`)
    setPath(route)
  }

  useEffect(() => {
    fetchStore()
  }, [])

  return (
    <Container fontSize={1} fontFamily={"body"} pb={3} pt={4} px={4}>
      <Flex mx={-2} alignItems="center">
        <LogoContainer width={1 / 12} mx={2}>
          <Logo style={{ transform: "scale(1.5)" }} />
        </LogoContainer>
        <Box mx={1}>
          <Text>{storeName || "Medusa store"}</Text>
        </Box>
      </Flex>
      <Flex py={4} mx={-1} flexDirection="column" flex={1}>
        <StyledItemContainer
          to="/a/orders"
          activeClassName="active"
          partiallyActive
        >
          <Orders />
          <Text ml={2} variant="nav">
            Orders
          </Text>
        </StyledItemContainer>
        <StyledItemContainer
          to="/a/products"
          activeClassName="active"
          partiallyActive
        >
          <Products />
          <Text ml={2} variant="nav">
            Products
          </Text>
        </StyledItemContainer>
        <StyledItemContainer
          to="/a/collections"
          activeClassName="active"
          partiallyActive
        >
          <Collections />
          <Text ml={2} variant="nav">
            Collections
          </Text>
        </StyledItemContainer>
        <StyledItemContainer
          to="/a/customers"
          activeClassName="active"
          partiallyActive
        >
          <Customers />
          <Text ml={2} variant="nav">
            Customers
          </Text>
        </StyledItemContainer>
        <StyledItemContainer
          to="/a/discounts"
          activeClassName="active"
          partiallyActive
        >
          <Discounts />
          <Text ml={2} variant="nav">
            Discounts
          </Text>
        </StyledItemContainer>
        <StyledItemContainer
          to="/a/gift-cards"
          activeClassName="active"
          partiallyActive
        >
          <GiftCard />
          <Text ml={2} variant="nav">
            Gift Cards
          </Text>
        </StyledItemContainer>
        <StyledItemContainer
          to="/a/settings"
          activeClassName="active"
          partiallyActive
        >
          <Settings />
          <Text ml={2} variant="nav">
            Settings
          </Text>
        </StyledItemContainer>
      </Flex>
      <Flex mx={-1} alignItems="center" justifyContent="center">
        <InlineLogoContainer px={2}>
          <Text
            fontFamily="Medusa"
            fontSize="18px"
            color="#454b54"
            fontWeight={300}
          >
            MEDUSA
          </Text>
        </InlineLogoContainer>
      </Flex>
    </Container>
  )
}

export default Sidebar
